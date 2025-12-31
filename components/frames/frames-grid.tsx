'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Button } from '@/components/ui/button'
import { ImageParallax } from '@/components/animations/image-parallax'
import { formatPrice } from '@/lib/utils'

interface Frame {
  id: string
  name: string
  description?: string | null
  imageUrl: string
  price: number
}

interface FramesGridProps {
  frames: Frame[]
}

export function FramesGrid({ frames }: FramesGridProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const cards = container.querySelectorAll('.frame-card')
    
    gsap.fromTo(
      cards,
      {
        y: 60,
        opacity: 0,
        scale: 0.9,
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: container,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      }
    )
  }, [])

  if (frames.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-xl text-gray-600 dark:text-gray-400">
          No frames available at the moment.
        </p>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {frames.map((frame) => (
        <div
          key={frame.id}
          className="frame-card group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
        >
          <div className="relative aspect-square">
            <ImageParallax
              src={frame.imageUrl}
              alt={frame.name}
              className="w-full h-full"
              intensity={0.03}
            />
            
            {/* Price Badge */}
            <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full px-3 py-1">
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                +{formatPrice(frame.price)}
              </span>
            </div>
          </div>

          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {frame.name}
            </h3>
            
            {frame.description && (
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 leading-relaxed">
                {frame.description}
              </p>
            )}

            <div className="flex items-center justify-between">
              <div>
                <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                  {formatPrice(frame.price)}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                  add-on
                </span>
              </div>
              
              <Link href="/order">
                <Button size="sm">
                  Add to Order
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}