'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth/auth-context'
import { Upload, Calculator, AlertCircle, CheckCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { RemoveButton } from '@/components/ui/remove-button'
import { RefreshButton } from '@/components/ui/refresh-button'
import { formatPrice, calculateDiscount } from '@/lib/utils'
import { createOrder } from '@/app/actions/order-actions'

interface OrderFormProps {
  pricing: any[]
  offers: any[]
}

interface FormErrors {
  [key: string]: string
}

export function OrderForm({ pricing = [], offers = [] }: OrderFormProps) {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const abortControllerRef = useRef<AbortController | null>(null)
  
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

  // ALL HOOKS MUST BE CALLED BEFORE ANY EARLY RETURNS
  
  // Calculate price function
  const calculatePrice = useCallback(() => {
    try {
      if (!formData.style || !formData.size || !formData.numberOfFaces || !pricing) {
        setPriceCalculation({
          basePrice: 0,
          discountAmount: 0,
          finalPrice: 0,
          appliedOffer: null,
        })
        return
      }

      const priceEntry = pricing.find(p => 
        p && 
        p.style === formData.style && 
        p.size === formData.size && 
        p.numberOfFaces === formData.numberOfFaces
      )

      if (!priceEntry || typeof priceEntry.basePrice !== 'number') {
        setPriceCalculation({
          basePrice: 0,
          discountAmount: 0,
          finalPrice: 0,
          appliedOffer: null,
        })
        return
      }

      const basePrice = Math.max(0, priceEntry.basePrice)
      const subtotal = basePrice

      let bestOffer = null
      let maxDiscount = 0

      try {
        if (formData.couponCode && formData.couponCode.trim() && offers && offers.length > 0) {
          const couponOffer = offers.find(o => 
            o && 
            o.couponCode && 
            o.couponCode.toUpperCase() === formData.couponCode.toUpperCase() &&
            o.isActive &&
            (o.minOrderValue ? subtotal >= o.minOrderValue : true) &&
            (Array.isArray(o.applicableStyles) ? 
              o.applicableStyles.length === 0 || o.applicableStyles.includes(formData.style) : 
              true)
          )
          
          if (couponOffer) {
            const discount = calculateDiscount(subtotal, couponOffer)
            if (discount > maxDiscount) {
              maxDiscount = discount
              bestOffer = couponOffer
            }
          }
        }

        if ((!bestOffer || maxDiscount === 0) && offers && offers.length > 0) {
          for (const offer of offers) {
            if (!offer || offer.couponCode) continue
            
            if (offer.minOrderValue && subtotal < offer.minOrderValue) continue
            if (Array.isArray(offer.applicableStyles) && 
                offer.applicableStyles.length > 0 && 
                !offer.applicableStyles.includes(formData.style)) continue
            
            try {
              const discount = calculateDiscount(subtotal, offer)
              if (discount > maxDiscount) {
                maxDiscount = discount
                bestOffer = offer
              }
            } catch (discountError) {
              console.warn('Error calculating discount for offer:', offer.id, discountError)
            }
          }
        }
      } catch (offerError) {
        console.warn('Error processing offers:', offerError)
      }

      const finalPrice = Math.max(0, subtotal - maxDiscount)

      setPriceCalculation({
        basePrice,
        discountAmount: maxDiscount,
        finalPrice,
        appliedOffer: bestOffer,
      })
    } catch (error) {
      console.error('Error calculating price:', error)
      setPriceCalculation({
        basePrice: 0,
        discountAmount: 0,
        finalPrice: 0,
        appliedOffer: null,
      })
    }
  }, [formData, pricing, offers])

  // Validate form fields
  const validateForm = useCallback(() => {
    const newErrors: FormErrors = {}

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Name is required'
    }

    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
      newErrors.customerEmail = 'Please enter a valid email'
    }

    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = 'Phone number is required'
    } else if (!/^[\d\s\-\+\(\)]{10,}$/.test(formData.customerPhone.replace(/\s/g, ''))) {
      newErrors.customerPhone = 'Please enter a valid phone number'
    }

    if (!formData.style) {
      newErrors.style = 'Please select an art style'
    }

    if (!formData.size) {
      newErrors.size = 'Please select a size'
    }

    if (images.length === 0) {
      newErrors.images = 'Please upload at least one image'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData, images])

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const files = Array.from(e.target.files || [])
      
      if (files.length === 0) return
      
      const validFiles = files.filter(file => {
        const isValidType = file.type.startsWith('image/')
        const isValidSize = file.size <= 10 * 1024 * 1024
        const hasValidName = file.name && file.name.length > 0
        return isValidType && isValidSize && hasValidName
      })
      
      if (validFiles.length !== files.length) {
        setErrors(prev => ({
          ...prev,
          images: 'Some files were skipped (invalid type or too large)'
        }))
      } else {
        setErrors(prev => {
          const newErrors = { ...prev }
          delete newErrors.images
          return newErrors
        })
      }
      
      setImages(prev => [...prev, ...validFiles].slice(0, 5))
    } catch (error) {
      console.error('Error handling image upload:', error)
      setErrors(prev => ({
        ...prev,
        images: 'Error uploading images. Please try again.'
      }))
    }
  }, [])

  const removeImage = useCallback((index: number) => {
    try {
      setImages(prev => prev.filter((_, i) => i !== index))
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors.images
        return newErrors
      })
    } catch (error) {
      console.error('Error removing image:', error)
    }
  }, [])

  const updateFormData = useCallback((field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }, [errors])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitAttempted(true)
    
    if (!validateForm()) {
      return
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    abortControllerRef.current = new AbortController()

    setLoading(true)
    setErrors({})

    try {
      const formDataToSend = new FormData()
      
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formDataToSend.append(key, value.toString())
        }
      })
      
      if (typeof priceCalculation.basePrice === 'number') {
        formDataToSend.append('basePrice', priceCalculation.basePrice.toString())
      }
      if (typeof priceCalculation.discountAmount === 'number') {
        formDataToSend.append('discountAmount', priceCalculation.discountAmount.toString())
      }
      if (typeof priceCalculation.finalPrice === 'number') {
        formDataToSend.append('finalPrice', priceCalculation.finalPrice.toString())
      }
      if (priceCalculation.appliedOffer?.id) {
        formDataToSend.append('offerId', priceCalculation.appliedOffer.id)
      }
      
      images.forEach((image, index) => {
        if (image && image.size > 0) {
          formDataToSend.append(`image-${index}`, image)
        }
      })

      const timeoutId = setTimeout(() => {
        if (abortControllerRef.current) {
          abortControllerRef.current.abort()
        }
      }, 30000)

      const result = await createOrder(formDataToSend)
      clearTimeout(timeoutId)
      
      if (result?.success && result?.orderId) {
        router.push(`/order/success?orderId=${result.orderId}`)
      } else {
        // Handle authentication errors specifically
        if (result?.requiresAuth) {
          // Redirect to sign in page
          router.push('/auth/signin?redirect=/order')
          return
        }
        setErrors({ submit: result?.error || 'Failed to create order. Please try again.' })
      }
    } catch (error) {
      console.error('Order submission error:', error)
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          setErrors({ submit: 'Request timed out. Please try again.' })
        } else {
          setErrors({ submit: error.message || 'Failed to create order. Please try again.' })
        }
      } else {
        setErrors({ submit: 'An unexpected error occurred. Please try again.' })
      }
    } finally {
      setLoading(false)
      abortControllerRef.current = null
    }
  }, [formData, priceCalculation, images, validateForm, router])

  // Mount effect
  useEffect(() => {
    setMounted(true)
    
    // Check for pre-selected style from URL parameters
    const urlParams = new URLSearchParams(window.location.search)
    const preSelectedStyle = urlParams.get('style')
    
    if (preSelectedStyle) {
      setFormData(prev => ({
        ...prev,
        style: preSelectedStyle
      }))
    }
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  // Pre-fill form data for logged-in users
  useEffect(() => {
    if (user && mounted) {
      setFormData(prev => ({
        ...prev,
        customerName: user.name || '',
        customerEmail: user.email || '',
      }))
    }
  }, [user, mounted])

  // Calculate price whenever form data changes
  useEffect(() => {
    if (mounted) {
      calculatePrice()
    }
  }, [formData, pricing, offers, mounted, calculatePrice])

  // NOW WE CAN HAVE EARLY RETURNS AFTER ALL HOOKS ARE CALLED

  // Show loading while checking authentication
  if (!mounted || authLoading) {
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
          <AlertCircle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
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

  // Show fallback if no pricing data
  if (!pricing || pricing.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="border border-red-500/20 bg-red-500/10 p-8 max-w-md mx-auto">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-light tracking-wide mb-6">
            Service Unavailable
          </h2>
          <p className="text-gray-400 mb-8 leading-relaxed">
            We're unable to load pricing information right now. Please try again later or contact us directly.
          </p>
          
          <div className="space-y-4">
            <a 
              href="/contact"
              className="block w-full px-6 py-3 bg-white text-black text-sm uppercase tracking-widest hover:bg-gray-200 transition-colors duration-300"
            >
              Contact Us
            </a>
            <RefreshButton className="block w-full px-6 py-3 border border-white/30 text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-colors duration-300 text-center">
              Try Again
            </RefreshButton>
          </div>
        </div>
      </div>
    )
  }

  // Get unique styles and sizes with fallbacks
  const styles = Array.from(new Set(
    (pricing || [])
      .filter(p => p && p.style)
      .map(p => p.style)
  ))
  
  const sizes = formData.style 
    ? Array.from(new Set(
        (pricing || [])
          .filter(p => p && p.style === formData.style && p.size)
          .map(p => p.size)
      ))
    : []

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Error Summary */}
      {submitAttempted && Object.keys(errors).length > 0 && (
        <div className="border border-red-500/20 bg-red-500/10 p-6 rounded-lg">
          <div className="flex items-center space-x-2 mb-4">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <h3 className="text-red-400 font-medium">Please fix the following errors:</h3>
          </div>
          <ul className="text-red-400 text-sm space-y-1">
            {Object.entries(errors).map(([field, error]) => (
              <li key={field}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="border border-white/20 p-8">
        <h2 className="text-2xl font-light tracking-wide text-white mb-6">
          Customer Information
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Input
            label="Full Name"
            value={formData.customerName}
            onChange={(e) => updateFormData('customerName', e.target.value)}
            required
            error={errors.customerName}
            className="bg-black border-white/20 text-white placeholder-gray-400 focus:border-white/40"
          />
          
          <Input
            label="Email Address"
            type="email"
            value={formData.customerEmail}
            onChange={(e) => updateFormData('customerEmail', e.target.value)}
            required
            error={errors.customerEmail}
            className="bg-black border-white/20 text-white placeholder-gray-400 focus:border-white/40"
          />
          
          <Input
            label="Phone Number"
            value={formData.customerPhone}
            onChange={(e) => updateFormData('customerPhone', e.target.value)}
            required
            error={errors.customerPhone}
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
            onChange={(e) => updateFormData('style', e.target.value)}
            options={[
              { value: '', label: 'Select Style' },
              ...styles.map(style => ({ value: style, label: style }))
            ]}
            required
            error={errors.style}
            className="bg-black border-white/20 text-white focus:border-white/40"
          />
          
          <Select
            label="Size"
            value={formData.size}
            onChange={(e) => updateFormData('size', e.target.value)}
            options={[
              { value: '', label: 'Select Size' },
              ...sizes.map(size => ({ value: size, label: size }))
            ]}
            disabled={!formData.style}
            required
            error={errors.size}
            className="bg-black border-white/20 text-white focus:border-white/40"
          />
          
          <Select
            label="Number of Faces"
            value={formData.numberOfFaces.toString()}
            onChange={(e) => updateFormData('numberOfFaces', parseInt(e.target.value) || 1)}
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
            onChange={(e) => updateFormData('specialNotes', e.target.value)}
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
            {errors.images && (
              <p className="text-red-400 text-sm mt-2">{errors.images}</p>
            )}
          </div>

          {images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                    onError={(e) => {
                      console.error('Image preview error:', e)
                      e.currentTarget.src = '/api/placeholder/100/100'
                    }}
                  />
                  <RemoveButton
                    onRemove={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  />
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
              <span className="font-medium text-white">
                {formatPrice(priceCalculation.basePrice)}
              </span>
            </div>
            
            {priceCalculation.discountAmount > 0 && (
              <div className="flex justify-between text-green-400">
                <span>
                  Discount ({priceCalculation.appliedOffer?.title || 'Applied'}):
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
              onChange={(e) => updateFormData('couponCode', e.target.value)}
              placeholder="Enter coupon code"
              className="bg-black border-white/20 text-white placeholder-gray-400 focus:border-white/40"
            />
            {formData.couponCode && formData.couponCode.trim() && (
              <div className="mt-2">
                {priceCalculation.appliedOffer?.couponCode === formData.couponCode.toUpperCase() ? (
                  <p className="text-green-400 text-sm flex items-center">
                    ✓ Coupon "{formData.couponCode.toUpperCase()}" applied successfully!
                  </p>
                ) : (
                  <p className="text-red-400 text-sm flex items-center">
                    ✗ Coupon "{formData.couponCode.toUpperCase()}" is not valid or doesn't meet requirements
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="text-center">
        <button
          type="submit"
          disabled={images.length === 0 || priceCalculation.finalPrice === 0 || loading}
          className="px-12 py-4 bg-white text-black text-sm uppercase tracking-widest hover:bg-gray-200 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto space-x-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4" />
              <span>Place Order - {formatPrice(priceCalculation.finalPrice)}</span>
            </>
          )}
        </button>
        
        {priceCalculation.finalPrice === 0 && (
          <p className="text-gray-400 text-sm mt-2">
            Please select style and size to see pricing
          </p>
        )}
      </div>
    </form>
  )
}