'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { GalleryDetailModal } from './gallery-detail-modal'

interface GalleryImage {
  id: string
  title: string
  description?: string | null
  imageUrl: string
  style: string
  tags: string[]
  createdAt: string
  updatedAt: string
}

interface GalleryGridProps {
  images: GalleryImage[]
}

export function GalleryGrid({ images }: GalleryGridProps) {
  const [filteredImages, setFilteredImages] = useState(images)
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

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

  const handleImageClick = (image: GalleryImage) => {
    setSelectedImage(image)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedImage(null)
  }

  if (filteredImages.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12 lg:py-16 px-4">
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400">
          No images found for the selected filter.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 px-4 sm:px-0">
        {filteredImages.map((image) => (
          <div
            key={image.id}
            className="group cursor-pointer"
            onClick={() => handleImageClick(image)}
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-gray-100 dark:bg-gray-800 rounded-lg">
              <Image
                src={image.imageUrl}
                alt={image.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 lg:p-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h3 className="text-sm sm:text-base lg:text-lg font-semibold mb-1">{image.title}</h3>
                <p className="text-xs sm:text-sm text-gray-200 mb-2">{image.style}</p>
                {image.description && (
                  <p className="text-xs text-gray-300 line-clamp-2 hidden sm:block">
                    {image.description}
                  </p>
                )}
                
                {/* Tags */}
                {image.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2 sm:mt-3">
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

                {/* Click indicator */}
                <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm rounded-full p-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      <GalleryDetailModal
        image={selectedImage}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  )
}