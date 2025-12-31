'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Upload, Palette, Eye, Truck } from 'lucide-react'

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
  },
]

export function HowItWorksSteps() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const cards = container.querySelectorAll('.step-card')
    
    gsap.fromTo(
      cards,
      {
        y: 80,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
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
    <div ref={containerRef} className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
      {steps.map((step, index) => {
        const Icon = step.icon
        
        return (
          <div
            key={step.title}
            className="step-card relative group"
          >
            {/* Connection Line */}
            {index < steps.length - 1 && (
              <div className="hidden lg:block absolute top-16 left-full w-8 h-0.5 bg-gradient-to-r from-primary-300 to-transparent z-10" />
            )}
            
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 h-full">
              {/* Step Number */}
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                {index + 1}
              </div>
              
              {/* Icon */}
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Icon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </div>
              
              {/* Content */}
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {step.title}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                {step.description}
              </p>
              
              {/* Details */}
              <ul className="space-y-2">
                {step.details.map((detail) => (
                  <li key={detail} className="flex items-start space-x-2 text-sm text-gray-500 dark:text-gray-400">
                    <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )
      })}
    </div>
  )
}