'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { gsap } from 'gsap'
import { Button } from '@/components/ui/button'
import { TextReveal } from '@/components/animations/text-reveal'

const artworkImages = [
  '/artworks/WhatsApp Image 2025-12-31 at 10.47.38 AM (1).jpeg',
  '/artworks/WhatsApp Image 2025-12-31 at 10.47.38 AM.jpeg',
  '/artworks/WhatsApp Image 2025-12-31 at 10.47.39 AM.jpeg',
  '/artworks/WhatsApp Image 2025-12-31 at 10.47.40 AM (1).jpeg',
  '/artworks/WhatsApp Image 2025-12-31 at 10.47.40 AM.jpeg',
]

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const container = containerRef.current
    const image = imageRef.current
    if (!container || !image) return

    // Initial states
    gsap.set(image, { scale: 1.1, opacity: 0 })

    // Animate in
    gsap.to(image, {
      scale: 1,
      opacity: 1,
      duration: 1.2,
      ease: 'power2.out',
      delay: 0.3,
    })

    // Floating animation
    gsap.to(image, {
      y: -10,
      duration: 3,
      ease: 'power1.inOut',
      yoyo: true,
      repeat: -1,
    })
  }, [])

  // Auto-rotate images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % artworkImages.length)
    }, 4000) // Change image every 4 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-primary-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" />
      
      {/* Content */}
      <div className="relative z-10 container-width section-padding">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-8">
            <TextReveal className="text-5xl lg:text-7xl font-bold leading-tight">
              Transform Photos into
              <span className="gradient-text block">Stunning Portraits</span>
            </TextReveal>
            
            <TextReveal 
              className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-lg"
              delay={0.3}
            >
              Professional artists create custom portraits from your photos. 
              Choose your style, upload your image, and get a masterpiece delivered to your door.
            </TextReveal>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/gallery">
                <Button size="lg" className="w-full sm:w-auto">
                  View Gallery
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  See Pricing
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200 dark:border-gray-700">
              <div>
                <div className="text-2xl font-bold text-primary-600">1000+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Happy Customers</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary-600">5000+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Portraits Created</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary-600">4.9★</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Average Rating</div>
              </div>
            </div>
          </div>

          {/* Right content - Hero image */}
          <div className="relative flex justify-center">
            <div 
              ref={imageRef}
              className="relative w-80 h-96 lg:w-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl"
            >
              {/* Main artwork image */}
              <div className="relative w-full h-full">
                <Image
                  src={artworkImages[currentImageIndex]}
                  alt="Custom Portrait Artwork"
                  fill
                  className="object-cover transition-opacity duration-1000"
                  priority
                />
                {/* Overlay gradient for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
              </div>

              {/* Image indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {artworkImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentImageIndex 
                        ? 'bg-white scale-125' 
                        : 'bg-white/50 hover:bg-white/75'
                    }`}
                  />
                ))}
              </div>

              {/* Badge overlay */}
              <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full px-3 py-1">
                <span className="text-xs font-medium text-gray-800 dark:text-gray-200">
                  Our Work
                </span>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-4 -right-6 w-20 h-20 bg-primary-500 rounded-full opacity-20 animate-pulse" />
            <div className="absolute -bottom-4 -left-6 w-16 h-16 bg-primary-400 rounded-full opacity-30 animate-pulse" style={{ animationDelay: '1s' }} />
            
            {/* Additional artwork thumbnails */}
            <div className="absolute -left-12 top-1/2 transform -translate-y-1/2 hidden lg:block">
              <div className="space-y-4">
                {artworkImages.slice(0, 3).map((image, index) => (
                  <div
                    key={index}
                    className={`w-12 h-16 rounded-lg overflow-hidden shadow-lg transition-all duration-300 cursor-pointer ${
                      index === currentImageIndex ? 'ring-2 ring-primary-500 scale-110' : 'hover:scale-105'
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <Image
                      src={image}
                      alt={`Artwork ${index + 1}`}
                      width={48}
                      height={64}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  )
}