'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { X, Calendar, Tag, Palette, Heart } from 'lucide-react'

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
  const [isFavorite, setIsFavorite] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    if (isOpen && image) {
      document.body.style.overflow = 'hidden'
      setIsLoading(true)
      
      // Check favorite status
      checkFavoriteStatus()
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, image])

  const checkFavoriteStatus = async () => {
    if (!image) return
    
    try {
      const response = await fetch(`/api/favorites/${image.id}`)
      if (response.ok) {
        setIsLoggedIn(true)
        const data = await response.json()
        setIsFavorite(data.isFavorite)
      } else if (response.status === 401) {
        setIsLoggedIn(false)
        // Check localStorage for non-logged users
        const saved = localStorage.getItem('favorites')
        if (saved) {
          const favorites = JSON.parse(saved)
          setIsFavorite(favorites.includes(image.id))
        }
      }
    } catch (error) {
      console.error('Error checking favorite status:', error)
      setIsLoggedIn(false)
      // Fallback to localStorage
      const saved = localStorage.getItem('favorites')
      if (saved) {
        const favorites = JSON.parse(saved)
        setIsFavorite(favorites.includes(image.id))
      }
    }
  }

  const toggleFavorite = async () => {
    if (!image) return
    
    if (!isLoggedIn) {
      // For non-logged users, use localStorage
      const saved = localStorage.getItem('favorites')
      const favorites = saved ? JSON.parse(saved) : []
      
      if (isFavorite) {
        const newFavorites = favorites.filter((id: string) => id !== image.id)
        localStorage.setItem('favorites', JSON.stringify(newFavorites))
        setIsFavorite(false)
      } else {
        const newFavorites = [...favorites, image.id]
        localStorage.setItem('favorites', JSON.stringify(newFavorites))
        setIsFavorite(true)
      }
      return
    }

    try {
      if (isFavorite) {
        // Remove from favorites
        const response = await fetch(`/api/favorites/${image.id}`, {
          method: 'DELETE'
        })
        
        if (response.ok) {
          setIsFavorite(false)
          // Update localStorage as backup
          const saved = localStorage.getItem('favorites')
          const favorites = saved ? JSON.parse(saved) : []
          const newFavorites = favorites.filter((id: string) => id !== image.id)
          localStorage.setItem('favorites', JSON.stringify(newFavorites))
        }
      } else {
        // Add to favorites
        const response = await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageId: image.id })
        })
        
        if (response.ok) {
          setIsFavorite(true)
          // Update localStorage as backup
          const saved = localStorage.getItem('favorites')
          const favorites = saved ? JSON.parse(saved) : []
          const newFavorites = [...favorites, image.id]
          localStorage.setItem('favorites', JSON.stringify(newFavorites))
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
      // Fallback to localStorage
      const saved = localStorage.getItem('favorites')
      const favorites = saved ? JSON.parse(saved) : []
      
      if (isFavorite) {
        const newFavorites = favorites.filter((id: string) => id !== image.id)
        localStorage.setItem('favorites', JSON.stringify(newFavorites))
        setIsFavorite(false)
      } else {
        const newFavorites = [...favorites, image.id]
        localStorage.setItem('favorites', JSON.stringify(newFavorites))
        setIsFavorite(true)
      }
    }
  }

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

            {/* Title and Favorite */}
            <div className="flex items-start justify-between mb-4 pr-12 lg:pr-0">
              <h2 className="text-2xl lg:text-3xl font-light text-white flex-1">
                {image.title}
              </h2>
              <button
                onClick={toggleFavorite}
                className={`ml-4 p-2 rounded-full transition-all duration-300 ${
                  isFavorite
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-red-500 hover:text-white'
                }`}
                title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
            </div>

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
            <div className="border-t border-gray-700 pt-4 mb-6">
              <div className="flex items-center gap-2 text-gray-400">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">
                  Created on {formatDate(image.createdAt)}
                </span>
              </div>
            </div>

            {/* Favorite Status for Non-logged Users */}
            {!isLoggedIn && (
              <div className="mb-6 p-3 bg-yellow-600/20 border border-yellow-600/30 rounded-lg">
                <p className="text-yellow-300 text-sm">
                  <Heart className="w-4 h-4 inline mr-1" />
                  Sign in to sync favorites across devices
                </p>
              </div>
            )}

            {/* Call to Action */}
            <div className="p-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg border border-gray-700">
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