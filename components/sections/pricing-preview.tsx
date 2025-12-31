'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TextReveal } from '@/components/animations/text-reveal'
import { formatPrice } from '@/lib/utils'

// Mock pricing data - in real app, this would come from the database
const pricingPlans = [
  {
    name: 'Basic',
    price: 1500,
    originalPrice: 2000,
    description: 'Perfect for single portraits',
    features: [
      '1 Person Portrait',
      'free delivery',
      '2 Revisions',
     
    ],
    popular: false,
  },
  {
    name: 'Premium',
    price: 2999,
    originalPrice: 3999,
    description: 'Great for couples and families',
    features: [
      'Up to 3 People',
      'Digital + Print Delivery',
      'Unlimited Revisions',
      'High Resolution',
      'Custom Frame Option',
    ],
    popular: true,
  },
  {
    name: 'Deluxe',
    price: 4999,
    originalPrice: 6499,
    description: 'Premium family portraits',
    features: [
      'Up to 5 People',
      'Digital + Print Delivery',
      'Unlimited Revisions',
      'High Resolution',
      'Premium Frame Included',
      'Express Delivery',
    ],
    popular: false,
  },
]

export function PricingPreview() {
  const containerRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    const container = containerRef.current
    const cards = cardsRef.current
    if (!container || !cards.length) return

    gsap.fromTo(
      cards,
      {
        y: 60,
        opacity: 0,
        scale: 0.95,
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
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
    <section ref={containerRef} className="py-24 bg-gray-50 dark:bg-gray-800/50">
      <div className="container-width section-padding">
        <div className="text-center mb-16">
          <TextReveal className="text-4xl lg:text-5xl font-bold mb-6">
            Simple
            <span className="gradient-text"> Pricing</span>
          </TextReveal>
          <TextReveal 
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
            delay={0.2}
          >
            Choose the perfect plan for your portrait needs. All plans include 
            professional artistry and satisfaction guarantee.
          </TextReveal>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <div
              key={plan.name}
              ref={(el) => {
                if (el) cardsRef.current[index] = el
              }}
              className={`relative p-8 rounded-2xl shadow-lg transition-all duration-300 hover:-translate-y-2 ${
                plan.popular
                  ? 'bg-primary-600 text-white scale-105'
                  : 'bg-white dark:bg-gray-800 hover:shadow-xl'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className={`text-2xl font-bold mb-2 ${
                  plan.popular ? 'text-white' : 'text-gray-900 dark:text-white'
                }`}>
                  {plan.name}
                </h3>
                <p className={`text-sm mb-4 ${
                  plan.popular ? 'text-primary-100' : 'text-gray-600 dark:text-gray-300'
                }`}>
                  {plan.description}
                </p>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-center space-x-2">
                    <span className={`text-3xl font-bold ${
                      plan.popular ? 'text-white' : 'text-gray-900 dark:text-white'
                    }`}>
                      {formatPrice(plan.price)}
                    </span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <span className={`text-lg line-through ${
                      plan.popular ? 'text-primary-200' : 'text-gray-500'
                    }`}>
                      {formatPrice(plan.originalPrice)}
                    </span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">
                      Save {Math.round(((plan.originalPrice - plan.price) / plan.originalPrice) * 100)}%
                    </span>
                  </div>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center space-x-3">
                    <Check className={`w-5 h-5 ${
                      plan.popular ? 'text-primary-200' : 'text-green-500'
                    }`} />
                    <span className={`text-sm ${
                      plan.popular ? 'text-primary-100' : 'text-gray-600 dark:text-gray-300'
                    }`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full ${
                  plan.popular
                    ? 'bg-white text-primary-600 hover:bg-gray-100'
                    : ''
                }`}
                variant={plan.popular ? 'default' : 'outline'}
              >
                Get Started
              </Button>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/pricing">
            <Button variant="outline" size="lg">
              View All Pricing Options
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}