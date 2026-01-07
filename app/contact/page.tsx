import { PageTransition } from '@/components/animations/page-transition'
import { Navbar } from '@/components/layout/navbar'
import { ContactForm } from '@/components/contact/contact-form'
import { Mail, Phone, MessageCircle, Clock, Star, Shield, Palette } from 'lucide-react'

export default function ContactPage() {
  const contactMethods = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: 'Email Us',
      description: 'Get a response within 24 hours',
      contact: 'hello@evoleotion.com',
      action: 'mailto:hello@evoleotion.com'
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: 'WhatsApp',
      description: 'Quick questions and updates',
      contact: '+91 7083259985',
      action: 'https://wa.me/917083259985'
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: 'Call Us',
      description: 'Speak directly with our team',
      contact: '+91 7083259985',
      action: 'tel:+917083259985'
    }
  ]

  const faqs = [
    {
      question: 'How long does it take to complete a portrait?',
      answer: 'Most portraits are completed within 3-5 business days. Complex pieces or rush orders may vary.'
    },
    {
      question: 'What photo quality do you need?',
      answer: 'High-resolution photos work best. We can work with phone photos, but clearer images produce better results.'
    },
    {
      question: 'Do you offer revisions?',
      answer: 'Yes! We provide one free revision to ensure you\'re completely satisfied with your portrait.'
    },
    {
      question: 'What sizes are available?',
      answer: 'We offer various sizes from 8x10 inches to 16x20 inches. Custom sizes are also available upon request.'
    }
  ]

  return (
    <PageTransition>
      <div className="min-h-screen bg-black text-white">
        {/* Navigation */}
        <Navbar />

        {/* Hero Section */}
        <section className="px-8 py-16">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-6xl md:text-8xl font-light tracking-wider mb-8 font-script">
              Get In Touch
            </h1>
            <p className="text-xl text-gray-400 max-w-4xl mx-auto leading-relaxed mb-12 font-grotesk">
              Ready to create your custom portrait? Have questions about our process? 
              We're here to help bring your vision to life.
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div className="text-center p-6 border border-white/10 rounded-lg">
                <Clock className="w-8 h-8 mx-auto mb-4 text-white" />
                <div className="text-2xl font-light mb-2">24 Hours</div>
                <div className="text-gray-400 text-sm">Average Response Time</div>
              </div>
              <div className="text-center p-6 border border-white/10 rounded-lg">
                <Star className="w-8 h-8 mx-auto mb-4 text-yellow-500" />
                <div className="text-2xl font-light mb-2">4.9/5</div>
                <div className="text-gray-400 text-sm">Customer Satisfaction</div>
              </div>
              <div className="text-center p-6 border border-white/10 rounded-lg">
                <Shield className="w-8 h-8 mx-auto mb-4 text-green-500" />
                <div className="text-2xl font-light mb-2">100%</div>
                <div className="text-gray-400 text-sm">Satisfaction Guarantee</div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="px-8 py-20 border-t border-white/10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-light tracking-wider mb-4 font-script">
                How to Reach Us
              </h2>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                Choose the method that works best for you. We're here to help!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {contactMethods.map((method, index) => (
                <a
                  key={index}
                  href={method.action}
                  className="block p-8 border border-white/10 hover:border-white/20 transition-colors rounded-lg text-center group"
                >
                  <div className="flex justify-center mb-6 text-white group-hover:scale-110 transition-transform">
                    {method.icon}
                  </div>
                  <h3 className="text-xl font-light mb-2">{method.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">{method.description}</p>
                  <p className="text-white font-medium">{method.contact}</p>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="px-8 py-20 border-t border-white/10">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* Contact Form */}
              <div>
                <h2 className="text-4xl font-light tracking-wider mb-8 font-script">
                  Send Us a Message
                </h2>
                <p className="text-gray-400 mb-8 leading-relaxed">
                  Tell us about your project and we'll get back to you with a personalized quote 
                  and timeline. The more details you provide, the better we can serve you.
                </p>
                <ContactForm />
              </div>

              {/* Additional Info */}
              <div>
                <h2 className="text-4xl font-light tracking-wider mb-8 font-script">
                  Commission Details
                </h2>
                
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-light mb-4 flex items-center">
                      <Palette className="w-5 h-5 mr-3" />
                      What We Offer
                    </h3>
                    <ul className="text-gray-400 space-y-2 text-sm">
                      <li>• Custom pencil and charcoal portraits</li>
                      <li>• Pet and animal portraits</li>
                      <li>• Family and group portraits</li>
                      <li>• Memorial and tribute artwork</li>
                      <li>• Corporate and professional headshots</li>
                      <li>• Wedding and special occasion art</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-light mb-4 flex items-center">
                      <Clock className="w-5 h-5 mr-3" />
                      Typical Timeline
                    </h3>
                    <div className="text-gray-400 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Quote & Approval:</span>
                        <span>Same day</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Artwork Creation:</span>
                        <span>3-5 days</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Revisions (if needed):</span>
                        <span>1-2 days</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Final Delivery:</span>
                        <span>Same day</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-light mb-4">
                      Starting Prices
                    </h3>
                    <div className="text-gray-400 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Single Person (8x10"):</span>
                        <span>$150</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pet Portrait (8x10"):</span>
                        <span>$120</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Couple (11x14"):</span>
                        <span>$200</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Family (16x20"):</span>
                        <span>$300+</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-4">
                      *Final pricing depends on complexity, size, and number of subjects
                    </p>
                  </div>

                  <div className="pt-6">
                    <a
                      href="/order"
                      className="inline-block px-8 py-3 bg-white text-black text-sm uppercase tracking-widest hover:bg-gray-200 transition-colors duration-300"
                    >
                      Start Your Order
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="px-8 py-20 border-t border-white/10">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-light tracking-wider mb-4 font-script">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-gray-400">
                Quick answers to common questions about our portrait services
              </p>
            </div>

            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="border border-white/10 rounded-lg p-6 hover:border-white/20 transition-colors">
                  <h3 className="text-lg font-light mb-3">{faq.question}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <p className="text-gray-400 mb-4">Still have questions?</p>
              <a
                href="mailto:hello@evoleotion.com"
                className="inline-block px-8 py-3 border border-white/30 text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-colors duration-300"
              >
                Email Us Directly
              </a>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  )
}