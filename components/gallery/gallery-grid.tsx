'use client'

import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ImageParallax } from '@/components/animations/image-parallax'

interface GalleryImage {
  id: string
  title: string
  description?: string | null
  imageUrl: string
  style: string
  tags: string[]
}

interface GalleryGridProps {
  images: GalleryImage[]
}

export function GalleryGrid({ images }: GalleryGridProps) {
  const [filteredImages, setFilteredImages] = useState(images)
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const grid = gridRef.current
    if (!grid) return

    const items = grid.querySelectorAll('.gallery-item')
    
    gsap.fromTo(
      items,
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
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: grid,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      }
    )
  }, [filteredImages])

  // Listen for filter changes from parent component
  useEffect(() => {
    const handleFilterChange = (event: CustomEvent) => {
      const { style } = event.detail
      setSelectedStyle(style)
      
      if (style === null) {
        setFilteredImages(images)
      } else {
        setFilteredImages(images.filter(img => img.style === style))
      }
    }

    window.addEventListener('gallery-filter-change', handleFilterChange as EventListener)
    return () => {
      window.removeEventListener('gallery-filter-change', handleFilterChange as EventListener)
    }
  }, [images])

  if (filteredImages.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-xl text-gray-600 dark:text-gray-400">
          No images found for the selected filter.
        </p>
      </div>
    )
  }

  return (
    <div 
      ref={gridRef}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      {filteredImages.map((image) => (
        <div
          key={image.id}
          className="gallery-item group cursor-pointer"
        >
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <ImageParallax
              src={image.imageUrl}
              alt={image.title}
              className="w-full h-full"
              intensity={0.05}
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <h3 className="text-lg font-semibold mb-1">{image.title}</h3>
              <p className="text-sm text-gray-200 mb-2">{image.style}</p>
              {image.description && (
                <p className="text-xs text-gray-300 line-clamp-2">
                  {image.description}
                </p>
              )}
              
              {/* Tags */}
              {image.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {image.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}