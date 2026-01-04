import { PageTransition } from '@/components/animations/page-transition'
import { Navbar } from '@/components/layout/navbar'

export default function ShippingPage() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-black text-white">
        {/* Navigation */}
        <Navbar />

        <div className="px-8 py-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-6xl md:text-8xl font-light tracking-wider mb-16">
              Shipping
            </h1>
            
            <div className="space-y-16">
              <section>
                <h2 className="text-2xl font-light tracking-wide mb-6">Delivery Process</h2>
                <p className="text-gray-400 mb-6 leading-relaxed">
                  Our portrait delivery process is designed to ensure your artwork arrives safely and on time.
                </p>
                <ul className="space-y-3 text-gray-400">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-white rounded-full mt-2 mr-4 flex-shrink-0"></span>
                    Digital preview sent within 5-7 business days
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-white rounded-full mt-2 mr-4 flex-shrink-0"></span>
                    Physical artwork shipped after approval
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-white rounded-full mt-2 mr-4 flex-shrink-0"></span>
                    Secure packaging to protect your portrait
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-white rounded-full mt-2 mr-4 flex-shrink-0"></span>
                    Tracking information provided
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-light tracking-wide mb-6">Shipping Options</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="border border-white/20 p-6">
                    <h3 className="text-lg font-light mb-3">Standard Shipping</h3>
                    <p className="text-gray-400 text-sm mb-2">7-10 business days</p>
                    <p className="text-gray-400 text-sm">Free for orders over ₹3,000</p>
                  </div>
                  <div className="border border-white/20 p-6">
                    <h3 className="text-lg font-light mb-3">Express Shipping</h3>
                    <p className="text-gray-400 text-sm mb-2">3-5 business days</p>
                    <p className="text-gray-400 text-sm">Additional ₹200</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-light tracking-wide mb-6">Packaging</h2>
                <p className="text-gray-400 leading-relaxed">
                  All portraits are carefully packaged with protective materials to ensure they arrive in perfect condition. 
                  We use acid-free backing boards and protective sleeves for all artwork.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}