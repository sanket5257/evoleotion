'use client'

import { useState } from 'react'
import { Plus, Edit, Trash2, Eye, EyeOff, Upload, Move } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils'
import Image from 'next/image'

interface Frame {
  id: string
  name: string
  description?: string | null
  imageUrl: string
  price: number
  isActive: boolean
  order: number
  createdAt: Date
  updatedAt: Date
}

interface FramesManagerProps {
  frames: Frame[]
}

export function FramesManager({ frames }: FramesManagerProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingFrame, setEditingFrame] = useState<Frame | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    isActive: true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingFrame) {
        // Update existing frame
        const response = await fetch(`/api/admin/frames/${editingFrame.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
        
        if (!response.ok) throw new Error('Failed to update frame')
      } else {
        // Create new frame
        const fileInput = document.getElementById('frame-image-upload') as HTMLInputElement
        const file = fileInput?.files?.[0]
        
        if (!file) {
          alert('Please select an image file')
          return
        }
        
        const formDataToSend = new FormData()
        formDataToSend.append('image', file)
        formDataToSend.append('name', formData.name)
        formDataToSend.append('description', formData.description)
        formDataToSend.append('price', formData.price.toString())
        formDataToSend.append('isActive', formData.isActive.toString())
        
        const response = await fetch('/api/admin/frames', {
          method: 'POST',
          body: formDataToSend
        })
        
        if (!response.ok) throw new Error('Failed to create frame')
      }
      
      // Refresh the page to show updated data
      window.location.reload()
    } catch (error) {
      console.error('Error saving frame:', error)
      alert('Failed to save frame. Please try again.')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      isActive: true,
    })
  }

  const handleEdit = (frame: Frame) => {
    setEditingFrame(frame)
    setFormData({
      name: frame.name,
      description: frame.description || '',
      price: frame.price,
      isActive: frame.isActive,
    })
    setShowAddForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this frame?')) {
      try {
        const response = await fetch(`/api/admin/frames/${id}`, {
          method: 'DELETE'
        })
        
        if (!response.ok) throw new Error('Failed to delete frame')
        
        // Refresh the page to show updated data
        window.location.reload()
      } catch (error) {
        console.error('Error deleting frame:', error)
        alert('Failed to delete frame. Please try again.')
      }
    }
  }

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/frames/${id}/toggle`, {
        method: 'PATCH'
      })
      
      if (!response.ok) throw new Error('Failed to toggle frame status')
      
      // Refresh the page to show updated data
      window.location.reload()
    } catch (error) {
      console.error('Error toggling frame status:', error)
      alert('Failed to update frame status. Please try again.')
    }
  }

  const moveFrame = async (id: string, direction: 'up' | 'down') => {
    // Temporarily disabled - reorder functionality will be added in a future update
    alert('Frame reordering is temporarily disabled. This feature will be available in a future update.')
    return
    
    /* 
    try {
      const response = await fetch(`/api/admin/frames/${id}/reorder`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ direction })
      })
      
      if (!response.ok) throw new Error('Failed to reorder frame')
      
      // Refresh the page to show updated data
      window.location.reload()
    } catch (error) {
      console.error('Error reordering frame:', error)
      alert('Failed to reorder frame. Please try again.')
    }
    */
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Frame Options ({frames.length})
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Manage frame options available for customer orders
          </p>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Frame</span>
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-semibold mb-4">
            {editingFrame ? 'Edit Frame' : 'Add New Frame'}
          </h4>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Frame Name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Classic Wood Frame"
                required
              />
              
              <Input
                label="Price (₹)"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                min="0"
                step="0.01"
                required
              />
            </div>

            <Textarea
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of the frame..."
              rows={3}
            />

            {!editingFrame && (
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Upload frame image
                </p>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="frame-image-upload"
                />
                <label htmlFor="frame-image-upload">
                  <Button type="button" variant="outline" className="cursor-pointer">
                    Choose File
                  </Button>
                </label>
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
                Active (available for orders)
              </label>
            </div>

            <div className="flex space-x-3">
              <Button type="submit">
                {editingFrame ? 'Update Frame' : 'Add Frame'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowAddForm(false)
                  setEditingFrame(null)
                  resetForm()
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Frames Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {frames.map((frame, index) => (
          <div
            key={frame.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <div className="relative aspect-square">
              <Image
                src={frame.imageUrl}
                alt={frame.name}
                fill
                className="object-cover"
              />
              <div className="absolute top-2 right-2 flex space-x-1">
                <button
                  onClick={() => toggleActive(frame.id, frame.isActive)}
                  className={`p-1 rounded-full ${
                    frame.isActive
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-500 text-white'
                  }`}
                >
                  {frame.isActive ? (
                    <Eye className="w-3 h-3" />
                  ) : (
                    <EyeOff className="w-3 h-3" />
                  )}
                </button>
              </div>
              
              {/* Order controls */}
              <div className="absolute top-2 left-2 flex flex-col space-y-1">
                {index > 0 && (
                  <button
                    onClick={() => moveFrame(frame.id, 'up')}
                    className="p-1 bg-white/80 rounded-full hover:bg-white"
                  >
                    <Move className="w-3 h-3 rotate-180" />
                  </button>
                )}
                {index < frames.length - 1 && (
                  <button
                    onClick={() => moveFrame(frame.id, 'down')}
                    className="p-1 bg-white/80 rounded-full hover:bg-white"
                  >
                    <Move className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  {frame.name}
                </h4>
                <Badge variant={frame.isActive ? 'default' : 'secondary'}>
                  {frame.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              
              {frame.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                  {frame.description}
                </p>
              )}

              <div className="flex justify-between items-center">
                <div className="text-lg font-bold text-primary-600 dark:text-primary-400">
                  +{formatPrice(frame.price)}
                </div>
                
                <div className="flex space-x-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit(frame)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(frame.id)}
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

      {frames.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Upload className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No frames yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Add your first frame option for customers to choose from
          </p>
          <Button onClick={() => setShowAddForm(true)}>
            Add First Frame
          </Button>
        </div>
      )}

      {/* Frame Statistics */}
      {frames.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Frame Statistics
          </h4>
          
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {frames.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Frames
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {frames.filter(f => f.isActive).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Active Frames
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                {formatPrice(Math.min(...frames.map(f => f.price)))}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Lowest Price
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                {formatPrice(Math.max(...frames.map(f => f.price)))}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Highest Price
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}