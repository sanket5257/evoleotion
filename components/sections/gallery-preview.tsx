'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { Button } from '@/components/ui/button'
import { TextReveal } from '@/components/animations/text-reveal'
import { ImageParallax } from '@/components/animations/image-parallax'

// Charcoal artwork images from public folder
const previewImages = [
  {
    id: 1,
    title: 'Charcoal Portrait 1',
    style: 'Charcoal',
    imageUrl: '/artworks/WhatsApp Image 2025-12-31 at 10.47.38 AM (1).jpeg',
  },
  {
    id: 2,
    title: 'Charcoal Portrait 2',
    style: 'Charcoal',
    imageUrl: '/artworks/WhatsApp Image 2025-12-31 at 10.47.38 AM.jpeg',
  },
  {
    id: 3,
    title: 'Charcoal Portrait 3',
    style: 'Charcoal',
    imageUrl: '/artworks/WhatsApp Image 2025-12-31 at 10.47.39 AM.jpeg',
  },
  {
    id: 4,
    title: 'Charcoal Portrait 4',
    style: 'Charcoal',
    imageUrl: '/artworks/WhatsApp Image 2025-12-31 at 10.47.40 AM (1).jpeg',
  },
]

export function GalleryPreview() {
  const containerRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const grid = gridRef.current
    if (!container || !grid) return

    const cards = grid.querySelectorAll('.gallery-card')

    gsap.fromTo(
      cards,
      {
        y: 80,
        opacity: 0,
        scale: 0.9,
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
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
  }, [])

  return (
    <section ref={containerRef} className="py-24">
      <div className="container-width section-padding">
        <div className="text-center mb-16">
          <TextReveal className="text-4xl lg:text-5xl font-bold mb-6">
            Our
            <span className="gradient-text"> Portfolio</span>
          </TextReveal>
          <TextReveal 
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8"
            delay={0.2}
          >
            Discover the artistry and craftsmanship in our charcoal portraits. 
            Each piece captures emotion and character with stunning detail.
          </TextReveal>
        </div>

        <div ref={gridRef} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {previewImages.map((image) => (
            <div
              key={image.id}
              className="gallery-card group cursor-pointer"
            >
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                <ImageParallax
                  src={image.imageUrl}
                  alt={image.title}
                  className="w-full h-full"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <h3 className="text-lg font-semibold mb-1">{image.title}</h3>
                  <p className="text-sm text-gray-200">{image.style}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link href="/gallery">
            <Button size="lg">
              View Full Gallery
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}