import { prisma } from '@/lib/prisma'
import { OffersManager } from '@/components/admin/offers-manager'

// Force dynamic rendering - prevents static generation at build time
export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getOffers() {
  try {
    return await prisma.offer.findMany({
      orderBy: { priority: 'desc' }
    })
  } catch (error) {
    console.error('Error fetching offers:', error)
    return []
  }
}

export default async function AdminOffersPage() {
  const offers = await getOffers()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Offers & Discounts</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Manage promotional offers, discounts, and coupon codes for sketch commissions
        </p>
      </div>

      <OffersManager offers={offers} />
    </div>
  )
}