import { OrderForm } from '@/components/order/order-form'
import { PageTransition } from '@/components/animations/page-transition'
import { prisma } from '@/lib/prisma'
import { Navbar } from '@/components/layout/navbar'

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
      <div className="min-h-screen bg-black text-white">
        {/* Navigation */}
        <Navbar />

        <div className="px-8 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-6xl md:text-8xl font-light tracking-wider mb-8">
                Order
              </h1>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                Create your custom pencil and charcoal portrait. 
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