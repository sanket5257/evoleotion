'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth/auth-context'
import { Upload, X, Calculator } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { formatPrice, calculateDiscount } from '@/lib/utils'
import { createOrder } from '@/app/actions/order-actions'

interface OrderFormProps {
  pricing: any[]
  offers: any[]
}

export function OrderForm({ pricing, offers }: OrderFormProps) {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    style: '',
    size: '',
    numberOfFaces: 1,
    specialNotes: '',
    couponCode: '',
  })
  const [images, setImages] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const [priceCalculation, setPriceCalculation] = useState({
    basePrice: 0,
    discountAmount: 0,
    finalPrice: 0,
    appliedOffer: null as any,
  })

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="text-center py-16">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400">Loading...</p>
      </div>
    )
  }

  // Show authentication required message if user is not logged in
  if (!user) {
    return (
      <div className="text-center py-16">
        <div className="border border-white/20 p-8 max-w-md mx-auto">
          <h2 className="text-2xl font-light tracking-wide mb-6">
            Sign Up Required
          </h2>
          <p className="text-gray-400 mb-8 leading-relaxed">
            You need to create an account to place an order. This helps us keep track of your orders and provide better customer service.
          </p>
          
          <div className="space-y-4">
            <a 
              href="/auth/signup"
              className="block w-full px-6 py-3 bg-white text-black text-sm uppercase tracking-widest hover:bg-gray-200 transition-colors duration-300"
            >
              Create Account
            </a>
            <a 
              href="/auth/signin"
              className="block w-full px-6 py-3 border border-white/30 text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-colors duration-300"
            >
              Already have an account? Sign In
            </a>
          </div>
          
          <div className="mt-8 text-sm text-gray-500">
            <p>Why do we require an account?</p>
            <ul className="mt-2 text-xs space-y-1">
              <li>• Track your order status</li>
              <li>• Save your preferences</li>
              <li>• Provide customer support</li>
              <li>• Send order updates</li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  // Pre-fill form data for logged-in users
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        customerName: user.name || '',
        customerEmail: user.email || '',
      }))
    }
  }, [user])

  // Get unique styles and sizes
  const styles = [...new Set(pricing.map(p => p.style))]
  const sizes = formData.style 
    ? [...new Set(pricing.filter(p => p.style === formData.style).map(p => p.size))]
    : []

  // Calculate price whenever form data changes
  useEffect(() => {
    calculatePrice()
  }, [formData, pricing, offers])

  const calculatePrice = () => {
    if (!formData.style || !formData.size || !formData.numberOfFaces) {
      setPriceCalculation({
        basePrice: 0,
        discountAmount: 0,
        finalPrice: 0,
        appliedOffer: null,
      })
      return
    }

    // Find base price
    const priceEntry = pricing.find(p => 
      p.style === formData.style && 
      p.size === formData.size && 
      p.numberOfFaces === formData.numberOfFaces
    )

    if (!priceEntry) return

    const basePrice = priceEntry.basePrice
    const subtotal = basePrice

    // Find applicable offers
    let bestOffer = null
    let maxDiscount = 0

    // Check coupon code first
    if (formData.couponCode) {
      const couponOffer = offers.find(o => 
        o.couponCode === formData.couponCode.toUpperCase() &&
        (o.minOrderValue ? subtotal >= o.minOrderValue : true) &&
        (o.applicableStyles.length === 0 || o.applicableStyles.includes(formData.style))
      )
      
      if (couponOffer) {
        const discount = calculateDiscount(subtotal, couponOffer)
        if (discount > maxDiscount) {
          maxDiscount = discount
          bestOffer = couponOffer
        }
      }
    }

    // Check auto-apply offers if no coupon or coupon gives less discount
    if (!bestOffer || maxDiscount === 0) {
      for (const offer of offers) {
        if (offer.couponCode) continue // Skip coupon offers for auto-apply
        
        if (offer.minOrderValue && subtotal < offer.minOrderValue) continue
        if (offer.applicableStyles.length > 0 && !offer.applicableStyles.includes(formData.style)) continue
        
        const discount = calculateDiscount(subtotal, offer)
        if (discount > maxDiscount) {
          maxDiscount = discount
          bestOffer = offer
        }
      }
    }

    const finalPrice = Math.max(0, subtotal - maxDiscount)

    setPriceCalculation({
      basePrice,
      discountAmount: maxDiscount,
      finalPrice,
      appliedOffer: bestOffer,
    })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    
    if (files.length === 0) return
    
    // Validate file types and sizes
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/')
      const isValidSize = file.size <= 10 * 1024 * 1024 // 10MB
      return isValidType && isValidSize
    })
    
    setImages(prev => [...prev, ...validFiles].slice(0, 5)) // Max 5 images
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (images.length === 0) {
      alert('Please upload at least one image')
      return
    }

    setLoading(true)
    try {
      const formDataToSend = new FormData()
      
      // Add form fields
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value.toString())
      })
      
      // Add price calculation
      formDataToSend.append('basePrice', priceCalculation.basePrice.toString())
      formDataToSend.append('discountAmount', priceCalculation.discountAmount.toString())
      formDataToSend.append('finalPrice', priceCalculation.finalPrice.toString())
      if (priceCalculation.appliedOffer) {
        formDataToSend.append('offerId', priceCalculation.appliedOffer.id)
      }
      
      // Add images
      images.forEach((image, index) => {
        formDataToSend.append(`image-${index}`, image)
      })

      const result = await createOrder(formDataToSend)
      
      if (result.success) {
        router.push(`/order/success?orderId=${result.orderId}`)
      } else {
        alert(result.error || 'Failed to create order')
      }
    } catch (error) {
      console.error('Order submission error:', error)
      alert('Failed to create order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="border border-white/20 p-8">
        <h2 className="text-2xl font-light tracking-wide text-white mb-6">
          Customer Information
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Input
            label="Full Name"
            value={formData.customerName}
            onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
            required
            className="bg-black border-white/20 text-white placeholder-gray-400 focus:border-white/40"
          />
          
          <Input
            label="Email Address"
            type="email"
            value={formData.customerEmail}
            onChange={(e) => setFormData(prev => ({ ...prev, customerEmail: e.target.value }))}
            required
            className="bg-black border-white/20 text-white placeholder-gray-400 focus:border-white/40"
          />
          
          <Input
            label="Phone Number"
            value={formData.customerPhone}
            onChange={(e) => setFormData(prev => ({ ...prev, customerPhone: e.target.value }))}
            required
            className="bg-black border-white/20 text-white placeholder-gray-400 focus:border-white/40"
          />
        </div>
      </div>

      <div className="border border-white/20 p-8">
        <h2 className="text-2xl font-light tracking-wide text-white mb-6">
          Portrait Details
        </h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <Select
            label="Art Style"
            value={formData.style}
            onChange={(e) => setFormData(prev => ({ ...prev, style: e.target.value, size: '' }))}
            options={[
              { value: '', label: 'Select Style' },
              ...styles.map(style => ({ value: style, label: style }))
            ]}
            required
            className="bg-black border-white/20 text-white focus:border-white/40"
          />
          
          <Select
            label="Size"
            value={formData.size}
            onChange={(e) => setFormData(prev => ({ ...prev, size: e.target.value }))}
            options={[
              { value: '', label: 'Select Size' },
              ...sizes.map(size => ({ value: size, label: size }))
            ]}
            disabled={!formData.style}
            required
            className="bg-black border-white/20 text-white focus:border-white/40"
          />
          
          <Select
            label="Number of Faces"
            value={formData.numberOfFaces.toString()}
            onChange={(e) => setFormData(prev => ({ ...prev, numberOfFaces: parseInt(e.target.value) }))}
            options={[
              { value: '1', label: '1 Person' },
              { value: '2', label: '2 People' },
              { value: '3', label: '3 People' },
              { value: '4', label: '4 People' },
              { value: '5', label: '5+ People' },
            ]}
            required
            className="bg-black border-white/20 text-white focus:border-white/40"
          />
        </div>

        <div className="mt-6">
          <Textarea
            label="Special Notes (Optional)"
            value={formData.specialNotes}
            onChange={(e) => setFormData(prev => ({ ...prev, specialNotes: e.target.value }))}
            placeholder="Any special requests or instructions for the artist..."
            rows={3}
            className="bg-black border-white/20 text-white placeholder-gray-400 focus:border-white/40"
          />
        </div>
      </div>

      <div className="border border-white/20 p-8">
        <h2 className="text-2xl font-light tracking-wide text-white mb-6">
          Upload Images
        </h2>
        
        <div className="space-y-4">
          <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">
              Upload your photos (Max 5 images, 10MB each)
            </p>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <label 
              htmlFor="image-upload" 
              className="inline-flex items-center justify-center px-4 py-2 border border-white/30 text-sm uppercase tracking-widest text-white hover:bg-white hover:text-black transition-colors duration-300 cursor-pointer"
            >
              Choose Files
            </label>
          </div>

          {images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Price Calculation */}
      {priceCalculation.basePrice > 0 && (
        <div className="border border-white/20 p-8">
          <div className="flex items-center space-x-2 mb-6">
            <Calculator className="w-6 h-6 text-white" />
            <h2 className="text-2xl font-light tracking-wide text-white">
              Price Calculation
            </h2>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Base Price:</span>
              <span className="font-medium text-white">{formatPrice(priceCalculation.basePrice)}</span>
            </div>
            
            {priceCalculation.discountAmount > 0 && (
              <div className="flex justify-between text-green-400">
                <span>
                  Discount ({priceCalculation.appliedOffer?.title}):
                </span>
                <span className="font-medium">
                  -{formatPrice(priceCalculation.discountAmount)}
                </span>
              </div>
            )}
            
            <div className="border-t border-white/20 pt-3">
              <div className="flex justify-between text-lg font-medium">
                <span className="text-white">Total:</span>
                <span className="text-white">
                  {formatPrice(priceCalculation.finalPrice)}
                </span>
              </div>
            </div>
          </div>

          {/* Coupon Code */}
          <div className="mt-6">
            <Input
              label="Coupon Code (Optional)"
              value={formData.couponCode}
              onChange={(e) => setFormData(prev => ({ ...prev, couponCode: e.target.value }))}
              placeholder="Enter coupon code"
              className="bg-black border-white/20 text-white placeholder-gray-400 focus:border-white/40"
            />
          </div>
        </div>
      )}

      <div className="text-center">
        <button
          type="submit"
          disabled={images.length === 0 || priceCalculation.finalPrice === 0 || loading}
          className="px-12 py-4 bg-white text-black text-sm uppercase tracking-widest hover:bg-gray-200 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : `Place Order - ${formatPrice(priceCalculation.finalPrice)}`}
        </button>
      </div>
    </form>
  )
}