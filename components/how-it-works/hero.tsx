'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ArrowDown, Play, Star } from 'lucide-react'
import { TextReveal } from '@/components/animations/text-reveal'

export function HowItWorksHero() {
  const videoRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const video = videoRef.current
    const stats = statsRef.current
    if (!video || !stats) return

    // Animate video container
    gsap.fromTo(
      video,
      { scale: 0.8, opacity: 0 },
      { 
        scale: 1, 
        opacity: 1, 
        duration: 1,
        delay: 0.5,
        ease: 'power2.out'
      }
    )

    // Animate stats
    gsap.fromTo(
      stats.children,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        delay: 0.8,
        ease: 'power2.out'
      }
    )
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container-width section-padding relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <TextReveal className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              From Photo to
              <span className="gradient-text block">Masterpiece</span>
            </TextReveal>
            
            <TextReveal 
              className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed"
              delay={0.2}
            >
              Watch your memories transform into stunning hand-crafted portraits through our proven artistic process
            </TextReveal>

            <TextReveal delay={0.4}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
                <button className="btn-primary text-lg px-8 py-4 rounded-full hover:scale-105 transition-transform">
                  Start Your Portrait
                </button>
                <button className="btn-secondary text-lg px-8 py-4 rounded-full flex items-center justify-center gap-2 hover:scale-105 transition-transform">
                  <Play className="w-5 h-5" />
                  Watch Process
                </button>
              </div>
            </TextReveal>

            {/* Stats */}
            <div ref={statsRef} className="grid grid-cols-3 gap-8 text-center lg:text-left">
              <div>
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-1">10K+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Happy Customers</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-1">7 Days</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Average Delivery</div>
              </div>
              <div>
                <div className="flex items-center justify-center lg:justify-start gap-1 mb-1">
                  <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">4.9</span>
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Customer Rating</div>
              </div>
            </div>
          </div>

          {/* Right Content - Video/Image Placeholder */}
          <div ref={videoRef} className="relative">
            <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
              {/* Video Placeholder */}
              <div className="aspect-[4/3] bg-gradient-to-br from-primary-100 to-purple-100 dark:from-primary-900/30 dark:to-purple-900/30 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center mb-4 mx-auto shadow-lg">
                    <Play className="w-8 h-8 text-primary-600 dark:text-primary-400 ml-1" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 font-medium">
                    See Our Process in Action
                  </p>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full animate-bounce" />
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-pink-400 rounded-full animate-pulse" />
              <div className="absolute top-1/2 -left-6 w-4 h-4 bg-blue-400 rounded-full animate-ping" />
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ArrowDown className="w-6 h-6 text-gray-400" />
        </div>
      </div>
    </section>
  )
}