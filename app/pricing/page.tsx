import { prisma } from '@/lib/prisma'
import { PricingTable } from '@/components/pricing/pricing-table'
import { PageTransition } from '@/components/animations/page-transition'
import { TextReveal } from '@/components/animations/text-reveal'

async function getPricingData() {
  const [pricing, offers] = await Promise.all([
    prisma.pricing.findMany({
      where: { isActive: true },
      orderBy: [
        { style: 'asc' },
        { numberOfFaces: 'asc' },
        { size: 'asc' }
      ]
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
}

export default async function PricingPage() {
  const { pricing, offers } = await getPricingData()

  return (
    <PageTransition>
      <div className="py-24">
        <div className="container-width section-padding">
          <div className="text-center mb-16">
            <TextReveal className="text-4xl lg:text-6xl font-bold mb-6">
              Transparent
              <span className="gradient-text block">Pricing</span>
            </TextReveal>
            <TextReveal 
              className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
              delay={0.2}
            >
              Professional charcoal and pencil portraits crafted by skilled artists. 
              All prices include unlimited revisions and our satisfaction guarantee.
            </TextReveal>
          </div>

          <PricingTable pricing={pricing} offers={offers} />

          {/* Additional Info */}
          <div className="mt-16 grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
              <div className="text-3xl mb-4">✏️</div>
              <h3 className="text-lg font-semibold mb-2">Charcoal & Pencil Art</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Specializing in charcoal and pencil portraits with exceptional detail
              </p>
            </div>
            
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
              <div className="text-3xl mb-4">🔄</div>
              <h3 className="text-lg font-semibold mb-2">Unlimited Revisions</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                We'll keep refining until you're completely satisfied
              </p>
            </div>
            
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
              <div className="text-3xl mb-4">🚚</div>
              <h3 className="text-lg font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Digital delivery in 3-5 days, physical prints in 7-10 days
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}