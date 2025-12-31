'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TextReveal } from '@/components/animations/text-reveal'

export function CTASection() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    gsap.fromTo(
      container.querySelector('.cta-content'),
      {
        y: 40,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: container,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      }
    )
  }, [])

  return (
    <section ref={containerRef} className="py-24">
      <div className="container-width section-padding">
        <div className="cta-content relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 p-12 lg:p-16 text-center text-white">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-20 -translate-y-20" />
            <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full translate-x-30 translate-y-30" />
            <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-white rounded-full" />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto">
            <TextReveal className="text-4xl lg:text-6xl font-bold mb-6">
              Ready to Create Your
              <span className="block text-primary-200">Masterpiece?</span>
            </TextReveal>
            
            <TextReveal 
              className="text-xl lg:text-2xl text-primary-100 mb-8 leading-relaxed"
              delay={0.2}
            >
              Join thousands of satisfied customers who have transformed their 
              precious memories into stunning works of art.
            </TextReveal>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/order">
                <Button 
                  size="lg" 
                  className="bg-white text-primary-600 hover:bg-gray-100 flex items-center space-x-2"
                >
                  <span>Start Your Order</span>
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              
              <Link href="/gallery">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-primary-600"
                >
                  View Gallery First
                </Button>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="mt-12 pt-8 border-t border-primary-500/30">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary-200">100%</div>
                  <div className="text-sm text-primary-100">Satisfaction Guarantee</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary-200">3-5 Days</div>
                  <div className="text-sm text-primary-100">Quick Delivery</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary-200">24/7</div>
                  <div className="text-sm text-primary-100">Customer Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}