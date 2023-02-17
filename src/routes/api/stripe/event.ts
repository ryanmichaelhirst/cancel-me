import { APIEvent, json } from 'solid-start/api'
import { prisma } from '~/lib/prisma'
import { stripe } from '~/lib/stripe'
import { StripeError, StripeEvent } from '~/types'

const signingSecret = process.env.STRIPE_SIGNING_SECRET ?? ''

const isStripeError = (err: unknown): err is StripeError =>
  typeof err === 'object' && err !== null && 'message' in err

const saveStripeDonation = async (event: StripeEvent) => {
  if (event.type === 'checkout.session.completed') {
    const userId = event.data.object.metadata.userId

    const existingDonations = await prisma.donation.findMany({
      where: {
        userId,
      },
    })
    const processedEvent = existingDonations.find((d) => {
      // @ts-ignore
      return d.payload?.id === event.id
    })

    if (processedEvent) {
      return
    }

    const donation = await prisma.donation.create({
      data: {
        userId,
        amount: event.data.object.amount_total.toString(),
        productName: event.data.object.metadata.productName,
        payload: event as unknown as any,
      },
    })
  }
}

export async function POST({ params, request }: APIEvent) {
  if (request.method !== 'POST') {
    return new Response('Not allowed', { status: 401 })
  }

  let event: StripeEvent | undefined

  const sig = request.headers.get('stripe-signature')

  if (!sig) {
    return new Response('Signature invalid', { status: 401 })
  }

  try {
    const requestText = await request.text()
    event = stripe.webhooks.constructEvent(requestText, sig, signingSecret) as StripeEvent
  } catch (err) {
    const errMessage = isStripeError(err) ? err.message : err

    return new Response(`Could not construct event: ${errMessage}`, { status: 500 })
  }

  switch (event.type) {
    case 'checkout.session.completed':
      await saveStripeDonation(event)
      break
    default:
      return new Response('No handler for event', { status: 500 })
  }

  return json({ received: true })
}
