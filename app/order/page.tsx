import { OrderForm } from '@/components/order/order-form'
import { PageTransition } from '@/components/animations/page-transition'
import { prisma } from '@/lib/prisma'

// Force dynamic rendering - prevents static generation at build time
export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getOrderData() {
  try {
    const [pricing, offers] = await Promise.all([
      prisma.pricing.findMany({
        where: { isActive: true },
        orderBy: { style: 'asc' }
      }),
      prisma.offer.findMany({
        where: {
          isActive: true,
          OR: [
            { startDate: null },
            { startDate: { lte: new Date() } }
          ],
          AND: [
            {
              OR: [
                { endDate: null },
                { endDate: { gte: new Date() } }
              ]
            }
          ]
        },
        orderBy: { priority: 'desc' }
      })
    ])

    return { pricing, offers }
  } catch (error) {
    console.error('Error fetching order data:', error)
    return { pricing: [], offers: [] }
  }
}

export default async function OrderPage() {
  const { pricing, offers } = await getOrderData()

  return (
    <PageTransition>
      <div className="min-h-screen py-12 bg-gray-50 dark:bg-gray-900">
        <div className="container-width section-padding">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Create Your
                <span className="gradient-text block">Custom Portrait</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Fill out the form below to start your portrait journey. 
                Our artists will transform your photos into stunning artwork.
              </p>
            </div>

            <OrderForm 
              pricing={pricing}
              offers={offers}
            />
          </div>
        </div>
      </div>
    </PageTransition>
  )
}