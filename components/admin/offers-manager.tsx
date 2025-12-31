'use client'

import { useState } from 'react'
import { Plus, Edit, Trash2, Eye, EyeOff, Tag, Percent, Gift } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils'

interface Offer {
  id: string
  title: string
  description?: string | null
  type: string
  value: number
  maxDiscount?: number | null
  couponCode?: string | null
  isActive: boolean
  priority: number
  startDate?: Date | null
  endDate?: Date | null
  minOrderValue?: number | null
  applicableStyles: string[]
  firstOrderOnly: boolean
  createdAt: Date
  updatedAt: Date
}

interface OffersManagerProps {
  offers: Offer[]
}

const OFFER_TYPES = [
  { value: 'FLAT_DISCOUNT', label: 'Flat Discount' },
  { value: 'PERCENTAGE_DISCOUNT', label: 'Percentage Discount' },
  { value: 'FIRST_ORDER_DISCOUNT', label: 'First Order Discount' },
]

const STYLES = ['Watercolor', 'Oil Painting', 'Pencil Sketch', 'Digital Art']

export function OffersManager({ offers }: OffersManagerProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    value: 0,
    maxDiscount: '',
    couponCode: '',
    isActive: true,
    priority: 0,
    startDate: '',
    endDate: '',
    minOrderValue: '',
    applicableStyles: [] as string[],
    firstOrderOnly: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const dataToSend = {
        ...formData,
        applicableStyles: formData.applicableStyles
      }
      
      if (editingOffer) {
        // Update existing offer
        const response = await fetch(`/api/admin/offers/${editingOffer.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataToSend)
        })
        
        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Failed to update offer')
        }
      } else {
        // Create new offer
        const response = await fetch('/api/admin/offers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataToSend)
        })
        
        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Failed to create offer')
        }
      }
      
      // Refresh the page to show updated data
      window.location.reload()
    } catch (error) {
      console.error('Error saving offer:', error)
      alert(`Failed to save offer: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: '',
      value: 0,
      maxDiscount: '',
      couponCode: '',
      isActive: true,
      priority: 0,
      startDate: '',
      endDate: '',
      minOrderValue: '',
      applicableStyles: [],
      firstOrderOnly: false,
    })
  }

  const handleEdit = (offer: Offer) => {
    setEditingOffer(offer)
    setFormData({
      title: offer.title,
      description: offer.description || '',
      type: offer.type,
      value: offer.value,
      maxDiscount: offer.maxDiscount?.toString() || '',
      couponCode: offer.couponCode || '',
      isActive: offer.isActive,
      priority: offer.priority,
      startDate: offer.startDate ? offer.startDate.toISOString().split('T')[0] : '',
      endDate: offer.endDate ? offer.endDate.toISOString().split('T')[0] : '',
      minOrderValue: offer.minOrderValue?.toString() || '',
      applicableStyles: offer.applicableStyles,
      firstOrderOnly: offer.firstOrderOnly,
    })
    setShowAddForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this offer?')) {
      try {
        const response = await fetch(`/api/admin/offers/${id}`, {
          method: 'DELETE'
        })
        
        if (!response.ok) throw new Error('Failed to delete offer')
        
        // Refresh the page to show updated data
        window.location.reload()
      } catch (error) {
        console.error('Error deleting offer:', error)
        alert('Failed to delete offer. Please try again.')
      }
    }
  }

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/offers/${id}/toggle`, {
        method: 'PATCH'
      })
      
      if (!response.ok) throw new Error('Failed to toggle offer status')
      
      // Refresh the page to show updated data
      window.location.reload()
    } catch (error) {
      console.error('Error toggling offer status:', error)
      alert('Failed to update offer status. Please try again.')
    }
  }

  const getOfferIcon = (type: string) => {
    switch (type) {
      case 'FLAT_DISCOUNT':
        return <Tag className="w-4 h-4" />
      case 'PERCENTAGE_DISCOUNT':
        return <Percent className="w-4 h-4" />
      case 'FIRST_ORDER_DISCOUNT':
        return <Percent className="w-4 h-4" />
      default:
        return <Tag className="w-4 h-4" />
    }
  }

  const formatOfferValue = (offer: Offer) => {
    switch (offer.type) {
      case 'FLAT_DISCOUNT':
        return formatPrice(offer.value)
      case 'PERCENTAGE_DISCOUNT':
      case 'FIRST_ORDER_DISCOUNT':
        return `${offer.value}%`
      default:
        return offer.value.toString()
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Active Offers ({offers.filter(o => o.isActive).length})
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Create and manage promotional offers and discount codes
          </p>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Offer</span>
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-semibold mb-4">
            {editingOffer ? 'Edit Offer' : 'Create New Offer'}
          </h4>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Offer Title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., New Year Special"
                required
              />
              
              <Select
                label="Offer Type"
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                options={[
                  { value: '', label: 'Select Type' },
                  ...OFFER_TYPES
                ]}
                required
              />
            </div>

            <Textarea
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of the offer..."
              rows={2}
            />

            <div className="grid md:grid-cols-3 gap-4">
              <Input
                label={formData.type === 'FLAT_DISCOUNT' ? 'Discount Amount (₹)' : 'Discount Percentage (%)'}
                type="number"
                value={formData.value}
                onChange={(e) => setFormData(prev => ({ ...prev, value: parseFloat(e.target.value) || 0 }))}
                min="0"
                step={formData.type === 'FLAT_DISCOUNT' ? '0.01' : '1'}
                required
              />

              {(formData.type === 'PERCENTAGE_DISCOUNT' || formData.type === 'FIRST_ORDER_DISCOUNT') && (
                <Input
                  label="Max Discount (₹)"
                  type="number"
                  value={formData.maxDiscount}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxDiscount: e.target.value }))}
                  placeholder="Optional cap"
                  min="0"
                  step="0.01"
                />
              )}

              <Input
                label="Priority"
                type="number"
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: parseInt(e.target.value) || 0 }))}
                placeholder="Higher = applied first"
                min="0"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Coupon Code (Optional)"
                value={formData.couponCode}
                onChange={(e) => setFormData(prev => ({ ...prev, couponCode: e.target.value.toUpperCase() }))}
                placeholder="e.g., SAVE20"
              />

              <Input
                label="Minimum Order Value (₹)"
                type="number"
                value={formData.minOrderValue}
                onChange={(e) => setFormData(prev => ({ ...prev, minOrderValue: e.target.value }))}
                placeholder="Optional minimum"
                min="0"
                step="0.01"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Start Date (Optional)"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
              />

              <Input
                label="End Date (Optional)"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Applicable Styles (Leave empty for all styles)
              </label>
              <div className="flex flex-wrap gap-2">
                {STYLES.map((style) => (
                  <label key={style} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.applicableStyles.includes(style)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData(prev => ({
                            ...prev,
                            applicableStyles: [...prev.applicableStyles, style]
                          }))
                        } else {
                          setFormData(prev => ({
                            ...prev,
                            applicableStyles: prev.applicableStyles.filter(s => s !== style)
                          }))
                        }
                      }}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{style}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.firstOrderOnly}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstOrderOnly: e.target.checked }))}
                  className="rounded"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  First order only
                </span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="rounded"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Active
                </span>
              </label>
            </div>

            <div className="flex space-x-3">
              <Button type="submit">
                {editingOffer ? 'Update Offer' : 'Create Offer'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowAddForm(false)
                  setEditingOffer(null)
                  resetForm()
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Offers Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-2">
                {getOfferIcon(offer.type)}
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  {offer.title}
                </h4>
              </div>
              <Badge variant={offer.isActive ? 'default' : 'secondary'}>
                {offer.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>

            {offer.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {offer.description}
              </p>
            )}

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Value:</span>
                <span className="font-medium">{formatOfferValue(offer)}</span>
              </div>
              
              {offer.couponCode && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Code:</span>
                  <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">
                    {offer.couponCode}
                  </code>
                </div>
              )}

              {offer.minOrderValue && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Min Order:</span>
                  <span>{formatPrice(offer.minOrderValue)}</span>
                </div>
              )}

              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Priority:</span>
                <span>{offer.priority}</span>
              </div>
            </div>

            {offer.applicableStyles.length > 0 && (
              <div className="mb-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Applicable to:</p>
                <div className="flex flex-wrap gap-1">
                  {offer.applicableStyles.map((style) => (
                    <Badge key={style} variant="outline" className="text-xs">
                      {style}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between items-center">
              <div className="flex space-x-1">
                <button
                  onClick={() => toggleActive(offer.id, offer.isActive)}
                  className={`p-1 rounded ${
                    offer.isActive
                      ? 'text-green-600 hover:text-green-700'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {offer.isActive ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => handleEdit(offer)}
                  className="p-1 text-blue-600 hover:text-blue-700"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(offer.id)}
                  className="p-1 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {offer.firstOrderOnly && (
                <Badge variant="outline" className="text-xs">
                  First Order
                </Badge>
              )}
            </div>
          </div>
        ))}
      </div>

      {offers.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Tag className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No offers yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Create your first promotional offer to boost sales
          </p>
          <Button onClick={() => setShowAddForm(true)}>
            Create First Offer
          </Button>
        </div>
      )}
    </div>
  )
}