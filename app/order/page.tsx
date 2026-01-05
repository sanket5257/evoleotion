import { OrderForm } from '@/components/order/order-form'
import { PageTransition } from '@/components/animations/page-transition'
import { supabaseServer } from '@/lib/supabase-server'
import { Navbar } from '@/components/layout/navbar'
import { ErrorBoundary } from '@/components/error-boundary'
import { RefreshButton } from '@/components/ui/refresh-button'

// Force dynamic rendering - prevents static generation at build time
export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getOrderData() {
  try {
    // Get pricing data
    const { data: pricing, error: pricingError } = await supabaseServer
      .from('pricing')
      .select('*')
      .eq('isActive', true)
      .order('style', { ascending: true })

    if (pricingError) {
      console.error('Pricing fetch error:', pricingError)
    }

    // Get active offers
    const currentDate = new Date().toISOString()
    const { data: offers, error: offersError } = await supabaseServer
      .from('offers')
      .select('*')
      .eq('isActive', true)
      .or(`startDate.is.null,startDate.lte.${currentDate}`)
      .or(`endDate.is.null,endDate.gte.${currentDate}`)
      .order('priority', { ascending: false })

    if (offersError) {
      console.error('Offers fetch error:', offersError)
    }

    return { 
      pricing: pricing || [], 
      offers: offers || [],
      error: null
    }
  } catch (error) {
    console.error('Error fetching order data:', error)
    
    // Return fallback data structure
    return { 
      pricing: [
        {
          id: 'fallback-1',
          style: 'Portrait',
          size: 'A4',
          numberOfFaces: 1,
          basePrice: 1500,
          isActive: true
        },
        {
          id: 'fallback-2',
          style: 'Sketch',
          size: 'A4',
          numberOfFaces: 1,
          basePrice: 1500,
          isActive: true
        },
        {
          id: 'fallback-3',
          style: 'Realistic',
          size: 'A4',
          numberOfFaces: 1,
          basePrice: 1500,
          isActive: true
        }
      ], 
      offers: [],
      error: 'Unable to load current pricing. Showing default options.'
    }
  }
}

export default async function OrderPage() {
  const { pricing, offers, error } = await getOrderData()

  return (
    <ErrorBoundary
      fallback={
        <div className="min-h-screen bg-black text-white">
          <Navbar />
          <div className="px-8 py-16">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-6xl md:text-8xl font-light tracking-wider mb-8">
                Order
              </h1>
              <div className="border border-red-500/20 bg-red-500/10 p-8 rounded-lg">
                <h2 className="text-2xl font-light mb-4">Service Temporarily Unavailable</h2>
                <p className="text-gray-400 mb-6">
                  We're experiencing technical difficulties. Please try again later or contact us directly.
                </p>
                <div className="space-y-4">
                  <a 
                    href="/contact"
                    className="inline-block px-8 py-3 bg-white text-black text-sm uppercase tracking-widest hover:bg-gray-200 transition-colors duration-300"
                  >
                    Contact Us
                  </a>
                  <br />
                  <RefreshButton className="inline-block px-8 py-3 border border-white/30 text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-colors duration-300">
                    Try Again
                  </RefreshButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    >
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
                
                {error && (
                  <div className="mt-6 p-4 border border-yellow-500/20 bg-yellow-500/10 rounded-lg">
                    <p className="text-yellow-400 text-sm">{error}</p>
                  </div>
                )}
              </div>

              <OrderForm 
                pricing={pricing || []}
                offers={offers || []}
              />
            </div>
          </div>
        </div>
      </PageTransition>
    </ErrorBoundary>
  )
}