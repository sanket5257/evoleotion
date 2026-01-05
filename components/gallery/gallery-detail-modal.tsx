'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { X, Calendar, Tag, Palette } from 'lucide-react'

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

interface GalleryDetailModalProps {
  image: GalleryImage | null
  isOpen: boolean
  onClose: () => void
}

export function GalleryDetailModal({ image, isOpen, onClose }: GalleryDetailModalProps) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      setIsLoading(true)
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen || !image) return null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full h-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row h-full gap-6">
          {/* Image Section */}
          <div className="flex-1 flex items-center justify-center">
            <div className="relative w-full h-full max-h-[80vh] lg:max-h-full">
              <div className="relative w-full h-full">
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900 rounded-lg">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                  </div>
                )}
                <Image
                  src={image.imageUrl}
                  alt={image.title}
                  fill
                  className="object-contain rounded-lg"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  onLoad={() => setIsLoading(false)}
                  priority
                />
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="lg:w-96 bg-gray-900/95 backdrop-blur-sm rounded-lg p-6 overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 lg:relative lg:top-0 lg:right-0 lg:ml-auto lg:mb-4 flex items-center justify-center w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors z-10"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            {/* Title */}
            <h2 className="text-2xl lg:text-3xl font-light text-white mb-4 pr-12 lg:pr-0">
              {image.title}
            </h2>

            {/* Style */}
            <div className="flex items-center gap-2 mb-4">
              <Palette className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-300 bg-gray-800 px-3 py-1 rounded-full">
                {image.style}
              </span>
            </div>

            {/* Description */}
            {image.description && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-white mb-2">About This Artwork</h3>
                <p className="text-gray-300 leading-relaxed">
                  {image.description}
                </p>
              </div>
            )}

            {/* Tags */}
            {image.tags.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="w-4 h-4 text-gray-400" />
                  <h3 className="text-lg font-medium text-white">Tags</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {image.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm hover:bg-gray-700 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Creation Date */}
            <div className="border-t border-gray-700 pt-4">
              <div className="flex items-center gap-2 text-gray-400">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">
                  Created on {formatDate(image.createdAt)}
                </span>
              </div>
            </div>

            {/* Call to Action */}
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg border border-gray-700">
              <h4 className="text-white font-medium mb-2">Love this style?</h4>
              <p className="text-gray-300 text-sm mb-3">
                Commission your own custom portrait in this style
              </p>
              <button 
                onClick={() => {
                  onClose()
                  // Navigate to order page with pre-selected style
                  window.location.href = `/order?style=${encodeURIComponent(image.style)}`
                }}
                className="w-full bg-white text-black py-2 px-4 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Order Similar Artwork
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}