'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Upload, Palette, Eye, Truck, ArrowRight } from 'lucide-react'

const steps = [
  {
    icon: Upload,
    title: 'Upload Your Photos',
    description: 'Share your favorite photos with us. We accept multiple formats and provide guidance for the best results.',
    details: [
      'High-resolution images preferred',
      'Multiple angles welcome',
      'Clear, well-lit photos work best',
    ],
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Palette,
    title: 'Artist Creates Magic',
    description: 'Our professional artists hand-craft your portrait using traditional techniques and modern tools.',
    details: [
      'Experienced professional artists',
      'Multiple style options available',
      'Attention to every detail',
    ],
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Eye,
    title: 'Review & Approve',
    description: 'We send you a preview for approval. Request unlimited revisions until you\'re completely satisfied.',
    details: [
      'High-quality preview sent',
      'Unlimited revision rounds',
      'Your satisfaction guaranteed',
    ],
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: Truck,
    title: 'Delivered to You',
    description: 'Once approved, we deliver your finished portrait directly to your doorstep with secure packaging.',
    details: [
      'Secure packaging included',
      'Fast delivery options',
      'Tracking information provided',
    ],
    color: 'from-orange-500 to-red-500',
  },
]

export function HowItWorksSteps() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const cards = container.querySelectorAll('.step-card')
    const connections = container.querySelectorAll('.connection-line')
    
    // Animate cards with more dynamic effects
    gsap.fromTo(
      cards,
      {
        y: 100,
        opacity: 0,
        scale: 0.8,
        rotateY: 45,
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        rotateY: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: container,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      }
    )

    // Animate connection lines
    gsap.fromTo(
      connections,
      {
        scaleX: 0,
        opacity: 0,
      },
      {
        scaleX: 1,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        delay: 0.5,
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
    <div ref={containerRef} className="relative px-4 sm:px-0">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        {steps.map((step, index) => {
          const Icon = step.icon
          
          return (
            <div
              key={step.title}
              className="step-card relative group"
            >
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="connection-line hidden lg:block absolute top-16 sm:top-20 left-full w-8 h-1 bg-gradient-to-r from-primary-300 via-primary-200 to-transparent z-10 origin-left">
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-primary-400 rounded-full animate-pulse" />
                </div>
              )}
              
              <div className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-4 h-full border border-gray-100 dark:border-gray-700 relative overflow-hidden">
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                
                {/* Icon */}
                <div className={`relative w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br ${step.color} rounded-2xl sm:rounded-3xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                  <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                
                {/* Content */}
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary-600 group-hover:to-purple-600 transition-all duration-300">
                  {step.title}
                </h3>
                
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4 sm:mb-6 leading-relaxed">
                  {step.description}
                </p>
                
                {/* Details */}
                <ul className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                  {step.details.map((detail) => (
                    <li key={detail} className="flex items-start space-x-2 sm:space-x-3 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      <div className="w-2 h-2 bg-primary-500 rounded-full mt-1.5 sm:mt-2 flex-shrink-0" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>

                {/* Hover Arrow */}
                <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 dark:text-primary-400" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Mobile Connection Indicators */}
      <div className="lg:hidden flex justify-center mt-6 sm:mt-8 space-x-2">
        {steps.map((_, index) => (
          <div key={index} className="flex items-center">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-primary-600 rounded-full" />
            {index < steps.length - 1 && (
              <div className="w-6 sm:w-8 h-0.5 bg-primary-300 mx-1.5 sm:mx-2" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}