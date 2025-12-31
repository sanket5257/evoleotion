import { ContactForm } from '@/components/contact/contact-form'
import { ContactInfo } from '@/components/contact/contact-info'
import { PageTransition } from '@/components/animations/page-transition'
import { TextReveal } from '@/components/animations/text-reveal'

export default function ContactPage() {
  return (
    <PageTransition>
      <div className="py-24">
        <div className="container-width section-padding">
          <div className="text-center mb-16">
            <TextReveal className="text-4xl lg:text-6xl font-bold mb-6">
              Get In
              <span className="gradient-text block">Touch</span>
            </TextReveal>
            <TextReveal 
              className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
              delay={0.2}
            >
              Have questions about our portrait services? We're here to help! 
              Reach out to us and we'll get back to you as soon as possible.
            </TextReveal>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <ContactInfo />
            <ContactForm />
          </div>
        </div>
      </div>
    </PageTransition>
  )
}