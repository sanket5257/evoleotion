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
        <div className="px-8 py-16">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-6xl md:text-8xl font-light tracking-wider mb-8">
              How It Works
            </h1>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed">
              From your photo to finished portrait in just a few simple steps. 
              Our proven process ensures you get exactly the artwork you envision.
            </p>
          </div>
        </div>
        
        {/* Process Overview */}
        <ProcessOverview />
        
        {/* Detailed Steps */}
        <section className="px-8 py-20 border-t border-white/10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-light tracking-wider mb-4">
                Step-by-Step Process
              </h2>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                Every portrait is crafted with care through our proven 4-step process
              </p>
            </div>
            <HowItWorksSteps />
          </div>
        </section>

        {/* Timeline Section */}
        <section className="px-8 py-20 border-t border-white/10">
          <div className="max-w-7xl mx-auto">
            <ProcessTimeline />
          </div>
        </section>
      </div>
    </PageTransition>
  )
}