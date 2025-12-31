'use client'

import { useState } from 'react'
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils'

interface Pricing {
  id: string
  style: string
  size: string
  numberOfFaces: number
  basePrice: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

interface PricingManagerProps {
  pricing: Pricing[]
}

const STYLES = ['Watercolor', 'Oil Painting', 'Pencil Sketch', 'Digital Art']
const SIZES = ['8x10', '11x14', '16x20', '18x24']
const FACE_OPTIONS = [
  { value: '1', label: '1 Person' },
  { value: '2', label: '2 People' },
  { value: '3', label: '3 People' },
  { value: '4', label: '4 People' },
  { value: '5', label: '5+ People' },
]

export function PricingManager({ pricing }: PricingManagerProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingPrice, setEditingPrice] = useState<Pricing | null>(null)
  const [formData, setFormData] = useState({
    style: '',
    size: '',
    numberOfFaces: 1,
    basePrice: 0,
    isActive: true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingPrice) {
        // Update existing pricing
        const response = await fetch(`/api/admin/pricing/${editingPrice.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
        
        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Failed to update pricing')
        }
      } else {
        // Create new pricing
        const response = await fetch('/api/admin/pricing', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
        
        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Failed to create pricing')
        }
      }
      
      // Refresh the page to show updated data
      window.location.reload()
    } catch (error) {
      console.error('Error saving pricing:', error)
      alert(`Failed to save pricing: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const resetForm = () => {
    setFormData({
      style: '',
      size: '',
      numberOfFaces: 1,
      basePrice: 0,
      isActive: true,
    })
  }

  const handleEdit = (price: Pricing) => {
    setEditingPrice(price)
    setFormData({
      style: price.style,
      size: price.size,
      numberOfFaces: price.numberOfFaces,
      basePrice: price.basePrice,
      isActive: price.isActive,
    })
    setShowAddForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this pricing rule?')) {
      try {
        const response = await fetch(`/api/admin/pricing/${id}`, {
          method: 'DELETE'
        })
        
        if (!response.ok) throw new Error('Failed to delete pricing')
        
        // Refresh the page to show updated data
        window.location.reload()
      } catch (error) {
        console.error('Error deleting pricing:', error)
        alert('Failed to delete pricing. Please try again.')
      }
    }
  }

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/pricing/${id}/toggle`, {
        method: 'PATCH'
      })
      
      if (!response.ok) throw new Error('Failed to toggle pricing status')
      
      // Refresh the page to show updated data
      window.location.reload()
    } catch (error) {
      console.error('Error toggling pricing status:', error)
      alert('Failed to update pricing status. Please try again.')
    }
  }

  // Group pricing by style for better organization
  const groupedPricing = pricing.reduce((acc, price) => {
    if (!acc[price.style]) {
      acc[price.style] = []
    }
    acc[price.style].push(price)
    return acc
  }, {} as Record<string, Pricing[]>)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Pricing Rules ({pricing.length})
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Configure pricing for different combinations of style, size, and number of faces
          </p>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Pricing Rule</span>
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-semibold mb-4">
            {editingPrice ? 'Edit Pricing Rule' : 'Add New Pricing Rule'}
          </h4>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <Select
                label="Style"
                value={formData.style}
                onChange={(e) => setFormData(prev => ({ ...prev, style: e.target.value }))}
                options={[
                  { value: '', label: 'Select Style' },
                  ...STYLES.map(style => ({ value: style, label: style }))
                ]}
                required
              />
              
              <Select
                label="Size"
                value={formData.size}
                onChange={(e) => setFormData(prev => ({ ...prev, size: e.target.value }))}
                options={[
                  { value: '', label: 'Select Size' },
                  ...SIZES.map(size => ({ value: size, label: size }))
                ]}
                required
              />

              <Select
                label="Number of Faces"
                value={formData.numberOfFaces.toString()}
                onChange={(e) => setFormData(prev => ({ ...prev, numberOfFaces: parseInt(e.target.value) }))}
                options={FACE_OPTIONS}
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Base Price (₹)"
                type="number"
                value={formData.basePrice}
                onChange={(e) => setFormData(prev => ({ ...prev, basePrice: parseFloat(e.target.value) || 0 }))}
                min="0"
                step="0.01"
                required
              />

              <div className="flex items-center space-x-2 pt-6">
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
            </div>

            <div className="flex space-x-3">
              <Button type="submit">
                {editingPrice ? 'Update Pricing' : 'Add Pricing'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowAddForm(false)
                  setEditingPrice(null)
                  resetForm()
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Pricing Table by Style */}
      <div className="space-y-6">
        {Object.entries(groupedPricing).map(([style, prices]) => (
          <div key={style} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                {style} ({prices.length} rules)
              </h4>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Size
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Faces
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {prices.map((price) => (
                    <tr key={price.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {price.size}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {price.numberOfFaces} {price.numberOfFaces === 1 ? 'Person' : 'People'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {formatPrice(price.basePrice)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={price.isActive ? 'default' : 'secondary'}>
                          {price.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => toggleActive(price.id, price.isActive)}
                            className={`p-1 rounded ${
                              price.isActive
                                ? 'text-green-600 hover:text-green-700'
                                : 'text-gray-400 hover:text-gray-600'
                            }`}
                          >
                            {price.isActive ? (
                              <Eye className="w-4 h-4" />
                            ) : (
                              <EyeOff className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => handleEdit(price)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(price.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {pricing.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Plus className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No pricing rules yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Create your first pricing rule to start accepting orders
          </p>
          <Button onClick={() => setShowAddForm(true)}>
            Add First Pricing Rule
          </Button>
        </div>
      )}
    </div>
  )
}