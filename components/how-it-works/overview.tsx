'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Upload, Palette, Eye, Truck, ArrowRight } from 'lucide-react'

const processSteps = [
  {
    icon: Upload,
    title: 'Upload',
    description: 'Share your photos',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Palette,
    title: 'Create',
    description: 'Artist crafts portrait',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Eye,
    title: 'Review',
    description: 'You approve the result',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: Truck,
    title: 'Deliver',
    description: 'Shipped to your door',
    color: 'from-orange-500 to-red-500',
  },
]

export function ProcessOverview() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const cards = container.querySelectorAll('.process-card')
    const arrows = container.querySelectorAll('.process-arrow')
    
    // Animate cards
    gsap.fromTo(
      cards,
      {
        y: 100,
        opacity: 0,
        scale: 0.8,
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: container,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      }
    )

    // Animate arrows
    gsap.fromTo(
      arrows,
      {
        x: -20,
        opacity: 0,
      },
      {
        x: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.2,
        delay: 0.4,
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
    <section className="py-20 bg-white dark:bg-gray-800">
      <div className="container-width section-padding">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Simple. Fast. Beautiful.
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Our streamlined process transforms your photos into stunning portraits in just 4 easy steps
          </p>
        </div>

        <div ref={containerRef} className="relative">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-4">
            {processSteps.map((step, index) => {
              const Icon = step.icon
              
              return (
                <div key={step.title} className="flex items-center">
                  {/* Process Card */}
                  <div className="process-card group cursor-pointer">
                    <div className="relative bg-white dark:bg-gray-700 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-4 border border-gray-100 dark:border-gray-600">
                      {/* Gradient Background */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`} />
                      
                      {/* Icon */}
                      <div className={`relative w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      
                      {/* Content */}
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary-600 group-hover:to-purple-600 transition-all duration-300">
                        {step.title}
                      </h3>
                      
                      <p className="text-gray-600 dark:text-gray-300 text-center">
                        {step.description}
                      </p>

                      {/* Step Number */}
                      <div className="absolute -top-3 -right-3 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                        {index + 1}
                      </div>
                    </div>
                  </div>

                  {/* Arrow */}
                  {index < processSteps.length - 1 && (
                    <div className="process-arrow hidden lg:flex items-center justify-center mx-4">
                      <ArrowRight className="w-8 h-8 text-gray-300 dark:text-gray-600" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Mobile Arrows */}
          <div className="lg:hidden flex flex-col items-center mt-8 space-y-4">
            {[1, 2, 3].map((_, index) => (
              <ArrowRight 
                key={index} 
                className="w-6 h-6 text-gray-300 dark:text-gray-600 rotate-90 process-arrow" 
              />
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to get started?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Join thousands of satisfied customers who've transformed their photos into art
            </p>
            <button className="btn-primary text-lg px-8 py-4 rounded-full hover:scale-105 transition-transform">
              Create Your Portrait Now
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}