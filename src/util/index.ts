import { prisma } from '~/lib/prisma'
import { twitterLite } from '~/lib/twitter-lite'

export const credentials = () => twitterLite.credentials

export const donations = ({ userId }: { userId: string }) => {
  return prisma.donation.findMany({ where: { userId } })
}
