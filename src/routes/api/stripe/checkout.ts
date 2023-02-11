import { APIEvent, redirect } from 'solid-start/api'
import { stripe } from '~/lib/stripe'

const DOMAIN_URL =
  process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://www.cancelme.io'

console.log(process.env.NODE_ENV, { DOMAIN_URL })

export async function POST({ request }: APIEvent) {
  console.log('hit api/stripe/checkout')

  try {
    const formData = await request.formData()
    const productId = formData.get('productId') as string
    const email = formData.get('email') as string
    const userId = formData.get('userId') as string

    // const body = await new Response(request.body).json()
    // const { productId, userId, email } = body

    const product = await stripe.products.retrieve(productId)
    const lineItem = {
      price: product.default_price?.toString() ?? '10.00',
      quantity: 1,
    }

    const session = await stripe.checkout.sessions.create({
      line_items: [lineItem],
      mode: 'payment',
      success_url: `${DOMAIN_URL}/donate?success=true&userId=${userId}`,
      cancel_url: `${DOMAIN_URL}/donate?canceled=true&userId=${userId}`,
      customer_email: email,
      metadata: {
        productId,
        productName: product.name,
        userId,
      },
    })

    return redirect(session.url ?? '', 303)
  } catch (err) {
    console.log(err)

    return new Response('No request body', { status: 401 })
  }
}
