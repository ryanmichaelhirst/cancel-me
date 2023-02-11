import { APIEvent, redirect } from 'solid-start/api'
import { stripe } from '~/lib/stripe'

export async function POST({ request }: APIEvent) {
  const url = new URL(request.url)
  const origin = url.origin
  console.log('hit api/stripe/checkout')
  console.log(`origin is ${origin}`)

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
      success_url: `${origin}/user/${userId}?transaction=completed`,
      cancel_url: `${origin}/user/${userId}?transaction=canceled`,
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
