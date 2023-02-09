import { APIEvent, json } from 'solid-start/api'
import { stripe } from '~/lib/stripe'

const toNumber = (value: string | number) => (typeof value === 'string' ? parseInt(value) : value)

const toDollarAmount = (value: string | number) => {
  const amount = toNumber(value)

  return `$${(amount / 100).toFixed(2)}`
}

const toDollarNumber = (value?: string | number | null) => {
  if (!value) return 0

  const amount = toNumber(value)

  return amount / 100
}

// step 2: handle authorization from twitter login
export async function GET({ params, request }: APIEvent) {
  try {
    const products = await stripe.products.list({ limit: 10, active: true })
    const prices = await stripe.prices.list({
      limit: 10,
    })

    const productsWithDollarAmounts = products.data.map((product) => {
      const stripePrice = prices.data.find((price) => price.id === product.default_price)
      const dollarAmount = stripePrice?.unit_amount
        ? toDollarAmount(stripePrice.unit_amount)
        : undefined

      return {
        ...product,
        dollarAmount,
        dollarNumber: toDollarNumber(stripePrice?.unit_amount),
        imageUrl: product.images[0],
      }
    })

    return json(
      productsWithDollarAmounts.filter((p) => {
        return p.metadata.tag === 'cancelme'
      }),
    )
  } catch (error) {
    console.log({ error })

    return json({ error })
  }
}
