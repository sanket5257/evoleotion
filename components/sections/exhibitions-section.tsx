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
    <section id="how-it-works" className="min-h-screen bg-black p-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-16">
          <h2 className="text-4xl md:text-6xl font-light tracking-wider mb-4">
            How It Works
          </h2>
          <div className="w-24 h-px bg-white/30" />
        </div>
        
        {/* Steps List */}
        <div className="space-y-12">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className="border-b border-white/10 pb-12 group cursor-pointer"
            >
              <div className="grid grid-cols-12 gap-8 items-center">
                {/* Number */}
                <div className="col-span-1">
                  <span className="text-6xl font-light text-white/20 group-hover:text-white/40 transition-colors duration-300">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                
                {/* Content */}
                <div className="col-span-7">
                  <h3 className="text-2xl md:text-3xl font-light tracking-wide mb-2 group-hover:text-gray-300 transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="text-gray-400 mb-4">
                    {step.description}
                  </p>
                  <div className="flex space-x-8 text-sm uppercase tracking-widest text-gray-500">
                    <span>{step.date}</span>
                    <span>{step.location}</span>
                  </div>
                </div>
                
                {/* Arrow */}
                <div className="col-span-4 flex justify-end">
                  <div className="w-12 h-12 border border-white/20 rounded-full flex items-center justify-center group-hover:border-white/40 group-hover:bg-white/5 transition-all duration-300">
                    <svg
                      className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
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
        <div className="mt-24 grid grid-cols-12 gap-8">
          <div className="col-span-6">
            <h3 className="text-xl font-light tracking-wide mb-4">
              Our Process
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              From your initial photo submission to the final artwork delivery, 
              we ensure every step is handled with care and professionalism.
            </p>
          </div>
          
          <div className="col-span-3">
            <h3 className="text-xl font-light tracking-wide mb-4">
              Quality
            </h3>
            <p className="text-gray-400 text-sm">
              Hand-drawn
            </p>
          </div>
          
          <div className="col-span-3">
            <h3 className="text-xl font-light tracking-wide mb-4">
              Timeline
            </h3>
            <p className="text-gray-400 text-sm">
              3-5 Days
            </p>
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="mt-24 text-center">
          <h2 className="text-4xl md:text-6xl font-light tracking-wider mb-4">
            Ready to Start?
          </h2>
          <p className="text-gray-400 mb-8">
            Create an account to place your order
          </p>
          <a 
            href="/order"
            className="inline-block px-12 py-4 border border-white/30 text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-colors duration-300"
          >
            Order Now
          </a>
        </div>
      </div>
    </section>
  )
}