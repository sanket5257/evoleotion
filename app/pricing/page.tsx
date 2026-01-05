import { supabaseServer } from '@/lib/supabase-server'
import { PricingTable } from '@/components/pricing/pricing-table'
import { PageTransition } from '@/components/animations/page-transition'
import { Star, Shield, Clock, Palette } from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'

// Force dynamic rendering - prevents static generation at build time
export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getPricingData() {
  try {
    // Get pricing data
    const { data: pricing, error: pricingError } = await supabaseServer
      .from('pricing')
      .select('*')
      .eq('isActive', true)
      .order('style', { ascending: true })
      .order('numberOfFaces', { ascending: true })
      .order('size', { ascending: true })

    if (pricingError) {
      console.error('Error fetching pricing:', pricingError)
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
      console.error('Error fetching offers:', offersError)
    }

    return { 
      pricing: pricing || [], 
      offers: offers || [] 
    }
  } catch (error) {
    console.error('Error fetching pricing data:', error)
    return { pricing: [], offers: [] }
  }
}

export default async function PricingPage() {
  const { pricing, offers } = await getPricingData()

  return (
    <PageTransition>
      <div className="min-h-screen bg-black text-white">
        {/* Navigation */}
        <Navbar />

        {/* Hero Section */}
        <div className="px-8 py-16">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-6xl md:text-8xl font-light tracking-wider mb-8">
                Pricing
              </h1>
              <p className="text-lg text-gray-400 max-w-4xl mx-auto leading-relaxed mb-12">
                Professional pencil and charcoal portraits crafted by skilled artists. 
                Choose your style, size, and number of people. All prices include our satisfaction guarantee.
              </p>
              
              {/* Trust Indicators */}
              <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <span>500+ Happy Customers</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-500" />
                  <span>100% Satisfaction Guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-500" />
                  <span>3-5 Day Delivery</span>
                </div>
              </div>
            </div>

            <PricingTable pricing={pricing} offers={offers} />
          </div>
        </div>

        {/* Features Section */}
        <div className="px-8 py-24 border-t border-white/10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-light tracking-wider mb-4">
                What's Included
              </h2>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                Every portrait comes with premium features to ensure you get exactly what you envision
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center p-8 border border-white/10 hover:border-white/20 transition-colors">
                <div className="w-16 h-16 mx-auto mb-6 border border-white/20 rounded-full flex items-center justify-center">
                  <Palette className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-light mb-3">Professional Artists</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Skilled artists with years of experience in charcoal and pencil portrait techniques
                </p>
              </div>

              <div className="text-center p-8 border border-white/10 hover:border-white/20 transition-colors">
                <div className="w-16 h-16 mx-auto mb-6 border border-white/20 rounded-full flex items-center justify-center">
                  <div className="text-2xl">✨</div>
                </div>
                <h3 className="text-xl font-light mb-3">Premium Quality</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  High-quality artwork with attention to detail and professional finishing
                </p>
              </div>

              <div className="text-center p-8 border border-white/10 hover:border-white/20 transition-colors">
                <div className="w-16 h-16 mx-auto mb-6 border border-white/20 rounded-full flex items-center justify-center">
                  <div className="text-2xl">📱</div>
                </div>
                <h3 className="text-xl font-light mb-3">Digital Delivery</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  High-resolution digital files delivered within 3-5 business days
                </p>
              </div>

              <div className="text-center p-8 border border-white/10 hover:border-white/20 transition-colors">
                <div className="w-16 h-16 mx-auto mb-6 border border-white/20 rounded-full flex items-center justify-center">
                  <div className="text-2xl">🎯</div>
                </div>
                <h3 className="text-xl font-light mb-3">Perfect Quality</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Museum-quality artwork suitable for printing and framing at any size
                </p>
              </div>
            </div>
            
            {/* Order CTA */}
            <div className="text-center mt-16">
              <a 
                href="/order"
                className="inline-block px-12 py-4 bg-white text-black text-sm uppercase tracking-widest hover:bg-gray-200 transition-colors duration-300"
              >
                Order Your Portrait Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}