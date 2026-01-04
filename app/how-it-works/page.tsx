import { HowItWorksSteps } from '@/components/how-it-works/steps'
import ProcessTimeline  from '@/components/how-it-works/timeline'
import { ProcessOverview } from '@/components/how-it-works/overview'
import { PageTransition } from '@/components/animations/page-transition'
import { Navbar } from '@/components/layout/navbar'

export default function HowItWorksPage() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-black text-white">
        {/* Navigation */}
        <Navbar />

        {/* Hero Section */}
        <div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light tracking-wider mb-4 sm:mb-6 lg:mb-8">
              How It Works
            </h1>
            <p className="text-base sm:text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed px-4">
              From your photo to finished portrait in just a few simple steps. 
              Our proven process ensures you get exactly the artwork you envision.
            </p>
          </div>
        </div>
        
        {/* Process Overview */}
        <ProcessOverview />
        
        {/* Detailed Steps */}
        <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 border-t border-white/10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8 sm:mb-12 lg:mb-16">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light tracking-wider mb-4">
                Step-by-Step Process
              </h2>
              <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto px-4">
                Every portrait is crafted with care through our proven 4-step process
              </p>
            </div>
            <HowItWorksSteps />
          </div>
        </section>

        {/* Timeline Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 border-t border-white/10">
          <div className="max-w-7xl mx-auto">
            <ProcessTimeline />
          </div>
        </section>
      </div>
    </PageTransition>
  )
}