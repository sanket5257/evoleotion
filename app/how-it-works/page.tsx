import { HowItWorksSteps } from '@/components/how-it-works/steps'
import { ProcessTimeline } from '@/components/how-it-works/timeline'
import { PageTransition } from '@/components/animations/page-transition'
import { TextReveal } from '@/components/animations/text-reveal'

export default function HowItWorksPage() {
  return (
    <PageTransition>
      <div className="py-24">
        <div className="container-width section-padding">
          <div className="text-center mb-16">
            <TextReveal className="text-4xl lg:text-6xl font-bold mb-6">
              How It
              <span className="gradient-text block">Works</span>
            </TextReveal>
            <TextReveal 
              className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
              delay={0.2}
            >
              From your photo to a stunning portrait in just a few simple steps. 
              Our streamlined process ensures quality results every time.
            </TextReveal>
          </div>

          <HowItWorksSteps />
          <ProcessTimeline />
        </div>
      </div>
    </PageTransition>
  )
}