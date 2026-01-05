'use client'

import { useState } from 'react'
import { Heart, Eye, Share2, Download, Grid, List } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface GalleryImage {
  id: string
  title: string
  description: string | null
  imageUrl: string
  style: string
  tags: string[]
  createdAt: Date
}

interface FavoritesManagerProps {
  galleryImages: GalleryImage[]
}

export function FavoritesManager({ galleryImages }: FavoritesManagerProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedStyle, setSelectedStyle] = useState<string>('')
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  // Get unique styles for filtering
  const styles = Array.from(new Set(galleryImages.map(img => img.style)))

  // Filter images based on selected style
  const filteredImages = selectedStyle 
    ? galleryImages.filter(img => img.style === selectedStyle)
    : galleryImages

  const toggleFavorite = (imageId: string) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(imageId)) {
      newFavorites.delete(imageId)
    } else {
      newFavorites.add(imageId)
    }
    setFavorites(newFavorites)
    
    // In a real app, you'd save this to the backend
    localStorage.setItem('favorites', JSON.stringify(Array.from(newFavorites)))
  }

  // Load favorites from localStorage on component mount
  useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('favorites')
      if (saved) {
        setFavorites(new Set(JSON.parse(saved)))
      }
    }
  })

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
            {filteredImages.length} {filteredImages.length === 1 ? 'image' : 'images'}
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
                      variant={favorites.has(image.id) ? 'default' : 'ghost'}
                      className="bg-white/20 backdrop-blur-sm"
                    >
                      <Heart className={`w-4 h-4 ${favorites.has(image.id) ? 'fill-current text-red-500' : ''}`} />
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
                  variant={favorites.has(image.id) ? 'default' : 'ghost'}
                >
                  <Heart className={`w-4 h-4 ${favorites.has(image.id) ? 'fill-current text-red-500' : ''}`} />
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
    </div>
  )
}