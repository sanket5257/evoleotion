'use client'

import { useState } from 'react'
import Image from 'next/image'
import { VideoLoader } from '@/components/ui/video-loader'

const portfolioItems = [
  {
    id: 1,
    title: 'Realistic Portraits',
    category: 'Pencil Art',
    image: '/artworks/WhatsApp Image 2025-12-31 at 10.47.38 AM (1).jpeg',
    size: 'large',
    video: '/videos/630534398d9471ade12fc55f_68222bff4288bb35ff4929b2_Spirit (New 3D Music Visual)-transcode.mp4'
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
    size: 'small',
    video: '/videos/630534398d9471ade12fc55f_68222c0477573df0f6bebb21_Trajadao (New 3D)-transcode.mp4'
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
    image: '/artworks/WhatsApp Image 2025-12-31 at 10.47.40 AM.jpeg',
    size: 'large',
    video: '/videos/glassyObj.3c74f580.mp4'
  }
]

export function PortfolioGrid() {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null)

  return (
    <section id="work" className="min-h-screen bg-black p-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-16">
          <h2 className="text-4xl md:text-6xl font-light tracking-wider mb-4">
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
                ${item.size === 'large' ? 'col-span-6 row-span-2' : ''}
                ${item.size === 'medium' ? 'col-span-4 row-span-1' : ''}
                ${item.size === 'small' ? 'col-span-3 row-span-1' : ''}
              `}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              {/* Background Image/Video */}
              {item.video && hoveredItem === item.id ? (
                <VideoLoader
                  src={item.video}
                  className="absolute inset-0 w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              ) : (
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
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