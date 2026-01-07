'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'

const portfolioItems = [
  {
    id: 1,
    title: 'Realistic Portraits',
    category: 'Pencil Art',
    image: '/artworks/WhatsApp Image 2025-12-31 at 10.47.38 AM (1).jpeg',
    size: 'large'
  },
  {
    id: 2,
    title: 'Pet Portraits',
    category: 'Charcoal Art',
    image: '/artworks/WhatsApp Image 2025-12-31 at 10.47.38 AM.jpeg',
    size: 'medium'
  },
  {
    id: 3,
    title: 'Family Sketches',
    category: 'Custom Work',
    image: '/artworks/WhatsApp Image 2025-12-31 at 10.47.39 AM.jpeg',
    size: 'small'
  },
  {
    id: 4,
    title: 'Character Studies',
    category: 'Artistic',
    image: '/artworks/WhatsApp Image 2025-12-31 at 10.47.40 AM (1).jpeg',
    size: 'medium'
  },
  {
    id: 5,
    title: 'Memorial Portraits',
    category: 'Special Commission',
    image: '/artworks/OIP.webp',
    size: 'large'
  }
]

export function PortfolioGrid() {
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set())

  const handleImageError = useCallback((itemId: number) => {
    setImageErrors(prev => new Set(prev).add(itemId))
  }, [])

  return (
    <section id="work" className="min-h-screen bg-black p-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-16">
          <h2 className="text-4xl font-script md:text-6xl font-light tracking-wider mb-4">
            Featured Portraits
          </h2>
          <div className="w-24 h-px bg-white/30" />
        </div>
        
        {/* Portfolio Grid */}
        <div className="portfolio-grid grid grid-cols-12 gap-4 auto-rows-[200px]">
          {portfolioItems.map((item) => (
            <div
              key={item.id}
              className={`
                relative overflow-hidden cursor-pointer group
                ${item.size === 'large' ? 'col-span-12 md:col-span-6 row-span-2' : ''}
                ${item.size === 'medium' ? 'col-span-12 md:col-span-4 row-span-1' : ''}
                ${item.size === 'small' ? 'col-span-12 md:col-span-3 row-span-1' : ''}
              `}
            >
              {/* Background Image */}
              {imageErrors.has(item.id) ? (
                <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                  <p className="text-white/60 text-sm">Image unavailable</p>
                </div>
              ) : (
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={() => handleImageError(item.id)}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={item.id <= 2} // Prioritize first 2 images
                />
              )}
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors duration-300" />
              
              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-xs uppercase tracking-widest text-gray-300 mb-2">
                    {item.category}
                  </p>
                  <h3 className="text-lg font-light tracking-wide">
                    {item.title}
                  </h3>
                </div>
              </div>
              
              {/* Hover Effect */}
              <div className="absolute inset-0 border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>
        
        {/* View More */}
        <div className="mt-16 text-center space-y-4">
          <a 
            href="/gallery"
            className="inline-block px-8 py-3 border border-white/30 text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-colors duration-300 mr-4"
          >
            View All Portraits
          </a>
          <a 
            href="/order"
            className="inline-block px-8 py-3 bg-white text-black text-sm uppercase tracking-widest hover:bg-gray-200 transition-colors duration-300"
          >
            Order Now
          </a>
        </div>
      </div>
    </section>
  )
}