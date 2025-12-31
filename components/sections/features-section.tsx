'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Palette, Clock, Shield, Heart } from 'lucide-react'
import { TextReveal } from '@/components/animations/text-reveal'

const features = [
  {
    icon: Palette,
    title: 'Multiple Art Styles',
    description: 'Choose from watercolor, oil painting, pencil sketch, and more artistic styles.',
  },
  {
    icon: Clock,
    title: 'Quick Turnaround',
    description: 'Get your custom portrait delivered within 3-5 business days.',
  },
  {
    icon: Shield,
    title: 'Quality Guarantee',
    description: 'Not satisfied? We offer unlimited revisions until you love it.',
  },
  {
    icon: Heart,
    title: 'Made with Love',
    description: 'Each portrait is hand-crafted by professional artists with attention to detail.',
  },
]

export function FeaturesSection() {
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
    <section ref={containerRef} className="py-24 bg-gray-50 dark:bg-gray-800/50">
      <div className="container-width section-padding">
        <div className="text-center mb-16">
          <TextReveal className="text-4xl lg:text-5xl font-bold mb-6">
            Why Choose Our
            <span className="gradient-text block">Portrait Service?</span>
          </TextReveal>
          <TextReveal 
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
            delay={0.2}
          >
            We combine traditional artistry with modern technology to create 
            portraits that capture the essence of your most precious moments.
          </TextReveal>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                ref={(el) => {
                  if (el) cardsRef.current[index] = el
                }}
                className="group p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="mb-6">
                  <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}