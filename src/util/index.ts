import { prisma } from '~/lib/prisma'
import { stripe } from '~/lib/stripe'
import { twitterLite } from '~/lib/twitter-lite'

export const credentials = () => twitterLite.credentials

export const donations = ({ userId }: { userId: string }) => {
  return prisma.donation.findMany({ where: { userId } })
}

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

export const getProducts = async () => {
  const products = await stripe.products.list({ limit: 10, active: true })
  const prices = await stripe.prices.list({
    limit: 10,
  })

  return products.data.map((product) => {
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
}
