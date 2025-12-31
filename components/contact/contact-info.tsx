'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Mail, MessageCircle, Clock, MapPin } from 'lucide-react'

const contactMethods = [
  {
    icon: MessageCircle,
    title: 'WhatsApp',
    description: 'Quick responses via WhatsApp',
    value: '+91 98765 43210',
    action: 'Chat Now',
    href: 'https://wa.me/919876543210',
  },
  {
    icon: Mail,
    title: 'Email',
    description: 'Send us a detailed message',
    value: 'hello@portraitstudio.com',
    action: 'Send Email',
    href: 'mailto:hello@portraitstudio.com',
  },
]

const businessInfo = [
  {
    icon: Clock,
    title: 'Business Hours',
    details: [
      'Monday - Friday: 9:00 AM - 6:00 PM',
      'Saturday: 10:00 AM - 4:00 PM',
      'Sunday: Closed',
    ],
  },
  {
    icon: MapPin,
    title: 'Service Areas',
    details: [
      'Worldwide shipping available',
      'Digital delivery globally',
      'Express shipping in major cities',
    ],
  },
]

export function ContactInfo() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const items = container.querySelectorAll('.contact-item')
    
    gsap.fromTo(
      items,
      {
        x: -50,
        opacity: 0,
      },
      {
        x: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: container,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      }
    )
  }, [])

  return (
    <div ref={containerRef} className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Let's Start a Conversation
        </h2>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          We're passionate about creating beautiful portraits and would love to hear about your project. 
          Choose the best way to reach us below.
        </p>
      </div>

      {/* Contact Methods */}
      <div className="space-y-4">
        {contactMethods.map((method) => {
          const Icon = method.icon
          
          return (
            <div
              key={method.title}
              className="contact-item group p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {method.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                    {method.description}
                  </p>
                  <p className="text-primary-600 dark:text-primary-400 font-medium mb-3">
                    {method.value}
                  </p>
                  
                  <a
                    href={method.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
                  >
                    {method.action} →
                  </a>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Business Info */}
      <div className="space-y-6">
        {businessInfo.map((info) => {
          const Icon = info.icon
          
          return (
            <div key={info.title} className="contact-item">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {info.title}
                  </h3>
                  <ul className="space-y-1">
                    {info.details.map((detail) => (
                      <li key={detail} className="text-gray-600 dark:text-gray-400 text-sm">
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* FAQ Link */}
      <div className="contact-item p-6 bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-2xl">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Frequently Asked Questions
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
          Find quick answers to common questions about our portrait services.
        </p>
        <a
          href="/faq"
          className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
        >
          View FAQ →
        </a>
      </div>
    </div>
  )
}