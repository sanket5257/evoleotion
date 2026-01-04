'use client'

export function ExhibitionsSection() {
  const steps = [
    {
      id: 1,
      title: 'Submit Your Photos',
      date: 'Step 1',
      location: 'Upload Process',
      description: 'Upload high-quality photos of your subject through our secure platform'
    },
    {
      id: 2,
      title: 'Choose Your Style',
      date: 'Step 2',
      location: 'Customization',
      description: 'Select pencil or charcoal style, size, and any special preferences'
    },
    {
      id: 3,
      title: 'Artist Creates Magic',
      date: 'Step 3',
      location: '3-5 Days',
      description: 'Our skilled artists hand-draw your portrait with meticulous attention to detail'
    },
    {
      id: 4,
      title: 'Receive Your Artwork',
      date: 'Step 4',
      location: 'Delivery',
      description: 'Get your finished portrait digitally and optionally as a physical print'
    }
  ]

  return (
    <section id="how-it-works" className="min-h-screen bg-black px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-wider mb-4">
            How It Works
          </h2>
          <div className="w-16 sm:w-20 lg:w-24 h-px bg-white/30" />
        </div>
        
        {/* Steps List */}
        <div className="space-y-8 sm:space-y-10 lg:space-y-12">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className="border-b border-white/10 pb-8 sm:pb-10 lg:pb-12 group cursor-pointer"
            >
              <div className="grid grid-cols-12 gap-4 sm:gap-6 lg:gap-8 items-center">
                {/* Number */}
                <div className="col-span-2 sm:col-span-1">
                  <span className="text-3xl sm:text-4xl lg:text-6xl font-light text-white/20 group-hover:text-white/40 transition-colors duration-300">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                
                {/* Content */}
                <div className="col-span-8 sm:col-span-9 lg:col-span-7">
                  <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-light tracking-wide mb-2 group-hover:text-gray-300 transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-400 mb-3 sm:mb-4 leading-relaxed">
                    {step.description}
                  </p>
                  <div className="flex flex-col sm:flex-row sm:space-x-6 lg:space-x-8 space-y-1 sm:space-y-0 text-xs sm:text-sm uppercase tracking-widest text-gray-500">
                    <span>{step.date}</span>
                    <span>{step.location}</span>
                  </div>
                </div>
                
                {/* Arrow */}
                <div className="col-span-2 sm:col-span-2 lg:col-span-4 flex justify-end">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 border border-white/20 rounded-full flex items-center justify-center group-hover:border-white/40 group-hover:bg-white/5 transition-all duration-300">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:translate-x-1 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Process Info */}
        <div className="mt-16 sm:mt-20 lg:mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6 sm:gap-8">
          <div className="sm:col-span-2 lg:col-span-6">
            <h3 className="text-lg sm:text-xl font-light tracking-wide mb-3 sm:mb-4">
              Our Process
            </h3>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
              From your initial photo submission to the final artwork delivery, 
              we ensure every step is handled with care and professionalism.
            </p>
          </div>
          
          <div className="lg:col-span-3">
            <h3 className="text-lg sm:text-xl font-light tracking-wide mb-3 sm:mb-4">
              Quality
            </h3>
            <p className="text-gray-400 text-sm sm:text-base">
              Hand-drawn
            </p>
          </div>
          
          <div className="lg:col-span-3">
            <h3 className="text-lg sm:text-xl font-light tracking-wide mb-3 sm:mb-4">
              Timeline
            </h3>
            <p className="text-gray-400 text-sm sm:text-base">
              3-5 Days
            </p>
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="mt-16 sm:mt-20 lg:mt-24 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light tracking-wider mb-4">
            Ready to Start?
          </h2>
          <p className="text-sm sm:text-base text-gray-400 mb-6 sm:mb-8 px-4">
            Create an account to place your order
          </p>
          <a 
            href="/order"
            className="inline-block px-8 sm:px-10 lg:px-12 py-3 sm:py-4 border border-white/30 text-xs sm:text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-colors duration-300"
          >
            Order Now
          </a>
        </div>
      </div>
    </section>
  )
}