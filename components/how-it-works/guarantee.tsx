'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Shield, RefreshCw, Award, Heart, CheckCircle } from 'lucide-react'

const guarantees = [
  {
    icon: Shield,
    title: '100% Satisfaction',
    description: 'Not happy? We\'ll make it right or refund your money.',
  },
  {
    icon: RefreshCw,
    title: 'Unlimited Revisions',
    description: 'We\'ll keep refining until you absolutely love it.',
  },
  {
    icon: Award,
    title: 'Professional Artists',
    description: 'Only experienced artists work on your portrait.',
  },
  {
    icon: Heart,
    title: 'Made with Love',
    description: 'Every portrait is crafted with care and attention.',
  },
]

const features = [
  'High-resolution digital delivery',
  'Multiple format options available',
  'Secure payment processing',
  'Fast customer support',
  'Worldwide shipping available',
  'Gift wrapping included',
]

export function QualityGuarantee() {
  const containerRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const featuresContainer = featuresRef.current
    if (!container || !featuresContainer) return

    const cards = container.querySelectorAll('.guarantee-card')
    const featureItems = featuresContainer.querySelectorAll('.feature-item')
    
    // Animate guarantee cards
    gsap.fromTo(
      cards,
      {
        y: 60,
        opacity: 0,
        rotateY: 45,
      },
      {
        y: 0,
        opacity: 1,
        rotateY: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: container,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      }
    )

    // Animate feature items
    gsap.fromTo(
      featureItems,
      {
        x: -30,
        opacity: 0,
      },
      {
        x: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: featuresContainer,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      }
    )
  }, [])

  return (
    <section className="py-20 bg-gradient-to-br from-primary-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20">
      <div className="container-width section-padding">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Our Promise to You
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            We stand behind every portrait with our comprehensive quality guarantee
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Guarantees */}
          <div>
            <div ref={containerRef} className="grid sm:grid-cols-2 gap-6">
              {guarantees.map((guarantee) => {
                const Icon = guarantee.icon
                
                return (
                  <div
                    key={guarantee.title}
                    className="guarantee-card bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 dark:border-gray-700"
                  >
                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {guarantee.title}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                      {guarantee.description}
                    </p>
                  </div>
                )
              })}
            </div>

            <div className="mt-8 p-6 bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-200 dark:border-green-800">
              <div className="flex items-start space-x-3">
                <Shield className="w-6 h-6 text-green-600 dark:text-green-400 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-green-800 dark:text-green-200 mb-1">
                    30-Day Money-Back Guarantee
                  </h4>
                  <p className="text-green-700 dark:text-green-300 text-sm">
                    If you're not completely satisfied with your portrait, we'll refund your money within 30 days of delivery.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Features */}
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                What's Included
              </h3>
              
              <div ref={featuresRef} className="space-y-4">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="feature-item flex items-center space-x-3"
                  >
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                      Starting at $49
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Free shipping included
                    </div>
                  </div>
                  <button className="btn-primary px-6 py-3 rounded-full hover:scale-105 transition-transform">
                    Get Started
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}