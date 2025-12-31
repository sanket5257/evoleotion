'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Edit, Trash2, Eye, EyeOff, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'

interface GalleryImage {
  id: string
  title: string
  description?: string | null
  imageUrl: string
  style: string
  tags: string[]
  isActive: boolean
  order: number
  createdAt: string // Changed from Date to string
  updatedAt: string // Changed from Date to string
}

interface GalleryManagerProps {
  images: GalleryImage[]
}

export function GalleryManager({ images }: GalleryManagerProps) {
  const router = useRouter()
  const [showAddForm, setShowAddForm] = useState(false)
  
  // Debug: Log the images prop
  console.log('GalleryManager received images:', images.length, images)
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    style: '',
    tags: '',
    isActive: true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      if (editingImage) {
        // Update existing image
        const response = await fetch(`/api/admin/gallery/${editingImage.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to update image')
        }
      } else {
        // Create new image
        if (!selectedFile) {
          alert('Please select an image file')
          return
        }

        console.log('Uploading file:', selectedFile.name, 'Size:', selectedFile.size, 'Type:', selectedFile.type)
        
        const formDataToSend = new FormData()
        formDataToSend.append('image', selectedFile)
        formDataToSend.append('title', formData.title)
        formDataToSend.append('description', formData.description)
        formDataToSend.append('style', formData.style)
        formDataToSend.append('tags', formData.tags)
        formDataToSend.append('isActive', formData.isActive.toString())
        
        console.log('Sending request to /api/admin/gallery...')
        const response = await fetch('/api/admin/gallery', {
          method: 'POST',
          body: formDataToSend
        })
        
        console.log('Response status:', response.status)
        
        if (!response.ok) {
          const errorData = await response.json()
          console.error('Upload error:', errorData)
          throw new Error(errorData.error || 'Failed to create image')
        }

        const result = await response.json()
        console.log('Upload successful:', result)
      }
      
      // Refresh the page to show updated data
      setShowAddForm(false)
      setEditingImage(null)
      resetForm()
      router.refresh()
    } catch (error) {
      console.error('Error saving image:', error)
      alert(`Failed to save image: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      style: '',
      tags: '',
      isActive: true,
    })
    setSelectedFile(null)
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleFileButtonClick = () => {
    console.log('File button clicked')
    if (fileInputRef.current) {
      console.log('Triggering file input click')
      fileInputRef.current.click()
    } else {
      console.log('File input ref not found')
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('File input changed')
    const file = e.target.files?.[0]
    console.log('Selected file:', file)
    
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        e.target.value = ''
        return
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB')
        e.target.value = ''
        return
      }
      
      console.log('File validated successfully:', file.name, file.size, file.type)
      setSelectedFile(file)
    }
  }

  const handleEdit = (image: GalleryImage) => {
    setEditingImage(image)
    setFormData({
      title: image.title,
      description: image.description || '',
      style: image.style,
      tags: image.tags.join(', '),
      isActive: image.isActive,
    })
    setShowAddForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this image?')) {
      try {
        const response = await fetch(`/api/admin/gallery/${id}`, {
          method: 'DELETE'
        })
        
        if (!response.ok) throw new Error('Failed to delete image')
        
        // Refresh the page to show updated data
        router.refresh()
      } catch (error) {
        console.error('Error deleting image:', error)
        alert('Failed to delete image. Please try again.')
      }
    }
  }

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/gallery/${id}/toggle`, {
        method: 'PATCH'
      })
      
      if (!response.ok) throw new Error('Failed to toggle image status')
      
      // Refresh the page to show updated data
      router.refresh()
    } catch (error) {
      console.error('Error toggling image status:', error)
      alert('Failed to update image status. Please try again.')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Portfolio Images ({images.length})
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Manage your gallery images and portfolio showcase
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={async () => {
              if (confirm('This will delete all placeholder/sample images. Are you sure?')) {
                try {
                  const response = await fetch('/api/admin/gallery/cleanup', {
                    method: 'POST'
                  })
                  const result = await response.json()
                  if (result.success) {
                    alert(`✅ Cleanup successful! Deleted ${result.deletedCount} placeholder images.`)
                    router.refresh()
                  } else {
                    alert(`❌ Cleanup failed: ${result.error}`)
                  }
                } catch (error) {
                  alert(`❌ Cleanup failed: ${error}`)
                }
              }
            }}
            variant="outline"
            size="sm"
            className="text-red-600 hover:text-red-700"
          >
            Clean Placeholders
          </Button>
          <Button
            onClick={async () => {
              try {
                const response = await fetch('/api/debug/gallery')
                const result = await response.json()
                console.log('Database images:', result)
                if (result.success) {
                  alert(`Database has ${result.count} images. Check console for full details.\n\nFirst image URL: ${result.images[0]?.imageUrl || 'No images'}`)
                } else {
                  alert(`Debug failed: ${result.error}`)
                }
              } catch (error) {
                alert(`Debug failed: ${error}`)
              }
            }}
            variant="outline"
            size="sm"
          >
            Debug DB
          </Button>
          <Button
            onClick={async () => {
              try {
                const response = await fetch('/api/test-cloudinary')
                const result = await response.json()
                if (result.success) {
                  alert('✅ Cloudinary is configured correctly!')
                } else {
                  alert(`❌ Cloudinary error: ${result.error}`)
                }
              } catch (error) {
                alert(`❌ Test failed: ${error}`)
              }
            }}
            variant="outline"
            size="sm"
          >
            Test Upload
          </Button>
          <Button
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Image</span>
          </Button>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-semibold mb-4">
            {editingImage ? 'Edit Image' : 'Add New Image'}
          </h4>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
              
              <Input
                label="Style"
                value={formData.style}
                onChange={(e) => setFormData(prev => ({ ...prev, style: e.target.value }))}
                placeholder="e.g., Watercolor, Oil Painting"
                required
              />
            </div>

            <Textarea
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of the artwork..."
              rows={3}
            />

            <Input
              label="Tags"
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              placeholder="portrait, watercolor, artistic (comma separated)"
            />

            {!editingImage && (
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Upload image file (max 10MB)
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleFileButtonClick}
                >
                  Choose File
                </Button>
                {selectedFile && (
                  <p className="mt-2 text-sm text-green-600 dark:text-green-400">
                    Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>
            )}

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                className="rounded"
              />
              <label htmlFor="isActive" className="text-sm text-gray-700 dark:text-gray-300">
                Active (visible in gallery)
              </label>
            </div>

            <div className="flex space-x-3">
              <Button type="submit" loading={isSubmitting} disabled={isSubmitting}>
                {isSubmitting 
                  ? (editingImage ? 'Updating...' : 'Uploading...') 
                  : (editingImage ? 'Update Image' : 'Add Image')
                }
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowAddForm(false)
                  setEditingImage(null)
                  resetForm()
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Debug Info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Debug Info:</h4>
          <p>Images received: {images.length}</p>
          {images.length > 0 && (
            <div className="mt-2 space-y-2">
              <p>First image URL: {images[0].imageUrl}</p>
              <p>First image title: "{images[0].title}"</p>
              <p>First image style: "{images[0].style}"</p>
              <p>First image description: "{images[0].description}"</p>
              <p>First image tags: {JSON.stringify(images[0].tags)}</p>
              <p>First image active: {images[0].isActive.toString()}</p>
              <details className="mt-2">
                <summary className="cursor-pointer">Full first image data</summary>
                <pre className="mt-2 text-xs bg-gray-200 dark:bg-gray-700 p-2 rounded overflow-auto">
                  {JSON.stringify(images[0], null, 2)}
                </pre>
              </details>
            </div>
          )}
        </div>
      )}

      {/* Images Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {images.map((image) => (
          <div
            key={image.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <div className="relative aspect-[4/5]">
              <Image
                src={image.imageUrl}
                alt={image.title}
                fill
                className="object-cover"
                onError={(e) => {
                  console.error('Image failed to load:', image.imageUrl, e)
                }}
                onLoad={() => {
                  console.log('Image loaded successfully:', image.imageUrl)
                }}
              />
              <div className="absolute top-2 right-2 flex space-x-1">
                <button
                  onClick={() => toggleActive(image.id, image.isActive)}
                  className={`p-1 rounded-full ${
                    image.isActive
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-500 text-white'
                  }`}
                >
                  {image.isActive ? (
                    <Eye className="w-3 h-3" />
                  ) : (
                    <EyeOff className="w-3 h-3" />
                  )}
                </button>
              </div>
            </div>

            <div className="p-4">
              {/* Debug each image */}
              {process.env.NODE_ENV === 'development' && (
                <div className="text-xs text-gray-500 mb-2 border-b pb-2">
                  Title: "{image.title}" | Style: "{image.style}" | Tags: {image.tags.length}
                </div>
              )}
              
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1" style={{color: 'red', fontSize: '16px'}}>
                {image.title || 'No Title'}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2" style={{color: 'blue', fontSize: '14px'}}>
                {image.style || 'No Style'}
              </p>
              
              {image.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {image.description}
                </p>
              )}
              
              {image.tags && image.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {image.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={`${tag}-${index}`} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {image.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{image.tags.length - 3}
                    </Badge>
                  )}
                </div>
              )}

              <div className="flex justify-between items-center">
                <Badge variant={image.isActive ? 'default' : 'secondary'}>
                  {image.isActive ? 'Active' : 'Inactive'}
                </Badge>
                
                <div className="flex space-x-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit(image)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(image.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {images.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Upload className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No images yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Start building your portfolio by adding your first image
          </p>
          <Button onClick={() => setShowAddForm(true)}>
            Add First Image
          </Button>
        </div>
      )}
    </div>
  )
}