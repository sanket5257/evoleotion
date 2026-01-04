import { PageTransition } from '@/components/animations/page-transition'
import { Footer } from '@/components/layout/footer'
import { Navbar } from '@/components/layout/navbar'

export default function ContactPage() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-black text-white">
        {/* Navigation */}
        <Navbar />

        {/* Contact Content */}
        <section className="px-8 py-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-6xl md:text-8xl font-light tracking-wider mb-16">
              Commission
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div>
                <h2 className="text-2xl font-light tracking-wide mb-8">
                  Create Your Custom Portrait
                </h2>
                <p className="text-gray-400 leading-relaxed mb-8">
                  Ready to transform your cherished memories into timeless art? 
                  Commission a custom pencil or charcoal portrait that captures 
                  the essence of your loved ones with stunning detail.
                </p>
                
                <div className="mb-8">
                  <a 
                    href="/order"
                    className="inline-block px-8 py-3 bg-white text-black text-sm uppercase tracking-widest hover:bg-gray-200 transition-colors duration-300"
                  >
                    Order Now
                  </a>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-light tracking-wide mb-2">Email</h3>
                    <a href="mailto:hello@evoleotion.com" className="text-gray-400 hover:text-white transition-colors">
                      hello@evoleotion.com
                    </a>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-light tracking-wide mb-2">Follow Our Work</h3>
                    <div className="flex space-x-4">
                      <a href="#" className="text-gray-400 hover:text-white transition-colors">Instagram</a>
                      <a href="#" className="text-gray-400 hover:text-white transition-colors">Pinterest</a>
                      <a href="#" className="text-gray-400 hover:text-white transition-colors">Etsy</a>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-light tracking-wide mb-2">Pricing</h3>
                    <div className="text-gray-400 text-sm space-y-1">
                      <p>Single Portrait: Starting at $150</p>
                      <p>Pet Portrait: Starting at $120</p>
                      <p>Family Portrait: Starting at $250</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <form className="space-y-6">
                  <div>
                    <input
                      type="text"
                      placeholder="Your Name"
                      className="w-full bg-transparent border-b border-white/20 py-3 text-white placeholder-gray-500 focus:border-white/40 focus:outline-none transition-colors"
                    />
                  </div>
                  
                  <div>
                    <input
                      type="email"
                      placeholder="Email Address"
                      className="w-full bg-transparent border-b border-white/20 py-3 text-white placeholder-gray-500 focus:border-white/40 focus:outline-none transition-colors"
                    />
                  </div>
                  
                  <div>
                    <select className="w-full bg-transparent border-b border-white/20 py-3 text-white focus:border-white/40 focus:outline-none transition-colors">
                      <option value="" className="bg-black">Portrait Type</option>
                      <option value="person" className="bg-black">Person Portrait</option>
                      <option value="pet" className="bg-black">Pet Portrait</option>
                      <option value="family" className="bg-black">Family Portrait</option>
                      <option value="couple" className="bg-black">Couple Portrait</option>
                    </select>
                  </div>
                  
                  <div>
                    <textarea
                      placeholder="Tell us about your vision (size, style preferences, special details)"
                      rows={4}
                      className="w-full bg-transparent border-b border-white/20 py-3 text-white placeholder-gray-500 focus:border-white/40 focus:outline-none transition-colors resize-none"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="px-8 py-3 border border-white/30 text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-colors duration-300"
                  >
                    Request Quote
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
        
        <Footer />
      </div>
    </PageTransition>
  )
}