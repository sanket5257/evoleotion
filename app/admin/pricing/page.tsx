import { prisma } from '@/lib/prisma'
import { PricingManager } from '@/components/admin/pricing-manager'

async function getPricingData() {
  return await prisma.pricing.findMany({
    orderBy: [
      { style: 'asc' },
      { numberOfFaces: 'asc' },
      { size: 'asc' }
    ]
  })
}

export default async function AdminPricingPage() {
  const pricing = await getPricingData()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Pricing Management</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Configure pricing rules for different styles, sizes, and number of faces
        </p>
      </div>

      <PricingManager pricing={pricing} />
    </div>
  )
}