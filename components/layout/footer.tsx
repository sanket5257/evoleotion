import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-black text-white border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 mb-12 sm:mb-16">
          {/* Brand */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-light tracking-wider mb-4">Evoleotion</h2>
              <p className="text-gray-400 text-base sm:text-lg leading-relaxed max-w-md">
                Master the art of pencil and charcoal sketching. From realistic portraits 
                to expressive drawings, discover the timeless beauty of traditional art.
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-base sm:text-lg font-light tracking-wide mb-4 sm:mb-6">Shop</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <a href="/" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm uppercase tracking-widest">
                  Portraits
                </a>
              </li>
              <li>
                <a href="/gallery" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm uppercase tracking-widest">
                  Gallery
                </a>
              </li>
              <li>
                <a href="/#how-it-works" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm uppercase tracking-widest">
                  How It Works
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm uppercase tracking-widest">
                  About
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm uppercase tracking-widest">
                  Commission
                </a>
              </li>
              <li>
                <a href="/order" className="text-white hover:text-gray-300 transition-colors text-xs sm:text-sm uppercase tracking-widest font-medium">
                  Order Now
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-base sm:text-lg font-light tracking-wide mb-4 sm:mb-6">Connect</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <a href="mailto:hello@evoleotion.com" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm break-all">
                  hello@evoleotion.com
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm uppercase tracking-widest">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm uppercase tracking-widest">
                  Pinterest
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm uppercase tracking-widest">
                  Etsy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-6 sm:pt-8 border-t border-white/10 space-y-4 md:space-y-0">
          <div className="flex flex-col sm:flex-row items-center sm:space-x-6 lg:space-x-8 space-y-2 sm:space-y-0 text-center sm:text-left">
            <p className="text-gray-500 text-xs uppercase tracking-widest">
              © {new Date().getFullYear()} Evoleotion Art Studio
            </p>
            <p className="text-gray-500 text-xs uppercase tracking-widest">
              Handcrafted with Love
            </p>
          </div>
          
          <div className="flex items-center space-x-4 sm:space-x-6">
            <a href="/shipping" className="text-gray-500 hover:text-white transition-colors text-xs uppercase tracking-widest">
              Shipping
            </a>
            <a href="/returns" className="text-gray-500 hover:text-white transition-colors text-xs uppercase tracking-widest">
              Returns
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}