'use client'

import { useState, useEffect } from 'react'
import { Heart, Eye, Share2, Download, Grid, List } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface GalleryImage {
  id: string
  title: string
  description: string | null
  imageUrl: string
  style: string
  tags: string[]
  createdAt: string
  updatedAt: string
}

interface FavoritesManagerProps {
  galleryImages: GalleryImage[]
}

export function FavoritesManager({ galleryImages }: FavoritesManagerProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedStyle, setSelectedStyle] = useState<string>('')
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [userFavorites, setUserFavorites] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)

  // Load user's favorites from the backend
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const response = await fetch('/api/favorites', {
          cache: 'no-store'
        })
        if (response.ok) {
          const favoritesData = await response.json()
          setUserFavorites(favoritesData)
          setFavorites(new Set(favoritesData.map((img: GalleryImage) => img.id)))
        } else if (response.status === 401) {
          // User not authenticated, use localStorage fallback
          const saved = localStorage.getItem('favorites')
          if (saved) {
            try {
              const favoriteIds = JSON.parse(saved)
              setFavorites(new Set(favoriteIds))
              // Filter gallery images to show only favorited ones
              const favoriteImages = galleryImages.filter(img => favoriteIds.includes(img.id))
              setUserFavorites(favoriteImages)
            } catch (e) {
              console.error('Error parsing localStorage favorites:', e)
            }
          }
        }
      } catch (error) {
        console.error('Error loading favorites:', error)
        // Fallback to localStorage
        const saved = localStorage.getItem('favorites')
        if (saved) {
          try {
            const favoriteIds = JSON.parse(saved)
            setFavorites(new Set(favoriteIds))
            // Filter gallery images to show only favorited ones
            const favoriteImages = galleryImages.filter(img => favoriteIds.includes(img.id))
            setUserFavorites(favoriteImages)
          } catch (e) {
            console.error('Error parsing localStorage favorites:', e)
          }
        }
      } finally {
        setLoading(false)
      }
    }

    loadFavorites()
  }, [galleryImages])

  // Get unique styles for filtering
  const styles = Array.from(new Set(userFavorites.map(img => img.style)))

  // Filter images based on selected style
  const filteredImages = selectedStyle 
    ? userFavorites.filter(img => img.style === selectedStyle)
    : userFavorites

  const toggleFavorite = async (imageId: string) => {
    try {
      const isFavorited = favorites.has(imageId)
      
      if (isFavorited) {
        // Remove from favorites
        const response = await fetch(`/api/favorites/${imageId}`, {
          method: 'DELETE'
        })
        
        if (response.ok) {
          const newFavorites = new Set(favorites)
          newFavorites.delete(imageId)
          setFavorites(newFavorites)
          setUserFavorites(prev => prev.filter(img => img.id !== imageId))
          
          // Update localStorage as backup
          localStorage.setItem('favorites', JSON.stringify(Array.from(newFavorites)))
        }
      } else {
        // Add to favorites
        const response = await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageId })
        })
        
        if (response.ok) {
          const newFavorites = new Set(favorites)
          newFavorites.add(imageId)
          setFavorites(newFavorites)
          
          // Find the image in galleryImages and add to userFavorites
          const imageToAdd = galleryImages.find(img => img.id === imageId)
          if (imageToAdd) {
            setUserFavorites(prev => [imageToAdd, ...prev])
          }
          
          // Update localStorage as backup
          localStorage.setItem('favorites', JSON.stringify(Array.from(newFavorites)))
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
      // Fallback to localStorage only
      const newFavorites = new Set(favorites)
      if (newFavorites.has(imageId)) {
        newFavorites.delete(imageId)
      } else {
        newFavorites.add(imageId)
      }
      setFavorites(newFavorites)
      localStorage.setItem('favorites', JSON.stringify(Array.from(newFavorites)))
    }
  }

  const shareImage = async (image: GalleryImage) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: image.title,
          text: image.description || 'Check out this amazing portrait!',
          url: window.location.origin + '/gallery'
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.origin + '/gallery')
      alert('Gallery link copied to clipboard!')
    }
  }

  return (
    <div className="space-y-8">
      {loading ? (
        <div className="text-center py-16">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your favorites...</p>
        </div>
      ) : (
        <>
          {/* Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <select
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value)}
                className="px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40"
              >
                <option value="">All Styles</option>
                {styles.map(style => (
                  <option key={style} value={style}>{style}</option>
                ))}
              </select>
              
              <span className="text-gray-400 text-sm">
                {filteredImages.length} {filteredImages.length === 1 ? 'favorite' : 'favorites'}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                onClick={() => setViewMode('grid')}
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => setViewMode('list')}
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Empty State */}
          {filteredImages.length === 0 && (
            <div className="text-center py-16">
              <div className="text-gray-400 mb-4">
                <Heart className="w-16 h-16 mx-auto mb-4" />
              </div>
              <h3 className="text-2xl font-light tracking-wide mb-4">No Favorites Yet</h3>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                Start exploring our gallery and save your favorite portraits for inspiration.
              </p>
              <a
                href="/gallery"
                className="inline-block px-8 py-3 bg-white text-black text-sm uppercase tracking-widest hover:bg-gray-200 transition-colors duration-300"
              >
                Browse Gallery
              </a>
            </div>
          )}

          {/* Grid View */}
          {viewMode === 'grid' && filteredImages.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredImages.map((image) => (
                <div key={image.id} className="group relative bg-white/5 border border-white/10 rounded-lg overflow-hidden hover:border-white/20 transition-colors">
                  <div className="aspect-square relative overflow-hidden">
                    <img
                      src={image.imageUrl}
                      alt={image.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
                        <Button
                          onClick={() => toggleFavorite(image.id)}
                          size="sm"
                          variant="default"
                          className="bg-red-500 hover:bg-red-600 text-white"
                        >
                          <Heart className="w-4 h-4 fill-current" />
                        </Button>
                        <Button
                          onClick={() => shareImage(image)}
                          size="sm"
                          variant="ghost"
                          className="bg-white/20 backdrop-blur-sm"
                        >
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-medium text-white mb-1 truncate">{image.title}</h3>
                    <p className="text-sm text-gray-400 mb-2">{image.style}</p>
                    {image.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {image.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-white/10 text-xs text-gray-300 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* List View */}
          {viewMode === 'list' && filteredImages.length > 0 && (
            <div className="space-y-4">
              {filteredImages.map((image) => (
                <div key={image.id} className="flex items-center space-x-4 p-4 bg-white/5 border border-white/10 rounded-lg hover:border-white/20 transition-colors">
                  <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                    <img
                      src={image.imageUrl}
                      alt={image.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-white truncate">{image.title}</h3>
                    <p className="text-sm text-gray-400">{image.style}</p>
                    {image.description && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{image.description}</p>
                    )}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {image.tags.slice(0, 5).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-white/10 text-xs text-gray-300 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <Button
                      onClick={() => toggleFavorite(image.id)}
                      size="sm"
                      variant="default"
                      className="bg-red-500 hover:bg-red-600 text-white"
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </Button>
                    <Button
                      onClick={() => shareImage(image)}
                      size="sm"
                      variant="ghost"
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Action Bar */}
          {filteredImages.length > 0 && (
            <div className="flex justify-center pt-8">
              <a
                href="/order"
                className="inline-block px-8 py-3 bg-white text-black text-sm uppercase tracking-widest hover:bg-gray-200 transition-colors duration-300"
              >
                Order Similar Portrait
              </a>
            </div>
          )}
        </>
      )}
    </div>
  )
}