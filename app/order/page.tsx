import { OrderForm } from '@/components/order/order-form'
import { PageTransition } from '@/components/animations/page-transition'
import { prisma } from '@/lib/prisma'

async function getOrderData() {
  const [pricing, frames, offers] = await Promise.all([
    prisma.pricing.findMany({
      where: { isActive: true },
      orderBy: { style: 'asc' }
    }),
    prisma.frame.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
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

  return { pricing, frames, offers }
}

export default async function OrderPage() {
  const { pricing, frames, offers } = await getOrderData()

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
              frames={frames}
              offers={offers}
            />
          </div>
        </div>
      </div>
    </PageTransition>
  )
}