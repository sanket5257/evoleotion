'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { formatPrice, calculateDiscount } from '@/lib/utils'

interface PricingItem {
  id: string
  style: string
  size: string
  numberOfFaces: number
  basePrice: number
  isActive: boolean
}

interface Offer {
  id: string
  title: string
  description?: string | null
  type: string
  value: number
  maxDiscount?: number | null
  couponCode?: string | null
  minOrderValue?: number | null
  applicableStyles: string[]
  priority: number
  isActive: boolean
}

interface PricingTableProps {
  pricing: PricingItem[]
  offers: Offer[]
}

export function PricingTable({ pricing, offers }: PricingTableProps) {
  // Compute styles and face counts directly
  const styles = Array.from(new Set(pricing.map(p => p.style)))
  const faceCounts = Array.from(new Set(pricing.map(p => p.numberOfFaces))).sort((a, b) => a - b)

  const [selectedStyle, setSelectedStyle] = useState(styles[0] || 'Digital Art')
  const [selectedFaces, setSelectedFaces] = useState(faceCounts[0] || 1)
  const containerRef = useRef<HTMLDivElement>(null)

  // Update state when data becomes available
  useEffect(() => {
    if (styles.length > 0 && (!selectedStyle || selectedStyle === 'Digital Art')) {
      console.log('Setting style to:', styles[0])
      setSelectedStyle(styles[0])
    }
  }, [styles.length])

  useEffect(() => {
    if (faceCounts.length > 0 && (!selectedFaces || selectedFaces === 1)) {
      console.log('Setting faces to:', faceCounts[0])
      setSelectedFaces(faceCounts[0])
    }
  }, [faceCounts.length])

  // Debug logging
  console.log('Selected style:', selectedStyle)
  console.log('Selected faces:', selectedFaces)
  console.log('Available styles:', styles)
  console.log('Available face counts:', faceCounts)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const cards = container.querySelectorAll('.pricing-card')
    
    gsap.fromTo(
      cards,
      {
        y: 60,
        opacity: 0,
        scale: 0.95,
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power2.out',
      }
    )
  }, [selectedStyle, selectedFaces])

  // Filter pricing based on selections - show all sizes for selected style and faces
  const filteredPricing = pricing.filter(p => 
    p.style === selectedStyle && p.numberOfFaces === selectedFaces
  )

  console.log('Filtered pricing:', filteredPricing.length, 'items')

  // Group by size to show different size options
  const pricingBySizes = filteredPricing.reduce((acc, price) => {
    if (!acc[price.size]) {
      acc[price.size] = price
    }
    return acc
  }, {} as Record<string, PricingItem>)

  const sizePricing = Object.values(pricingBySizes)

  // Handler functions
  const handleStyleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStyle = e.target.value
    console.log('Style changed to:', newStyle)
    setSelectedStyle(newStyle)
  }

  const handleFacesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFaces = parseInt(e.target.value)
    console.log('Faces changed to:', newFaces)
    setSelectedFaces(newFaces)
  }

  // Calculate best offer for each price
  const getPriceWithOffer = (basePrice: number) => {
    let bestDiscount = 0
    let bestOffer: Offer | null = null

    for (const offer of offers) {
      if (offer.couponCode) continue // Skip coupon offers
      if (offer.minOrderValue && basePrice < offer.minOrderValue) continue
      if (offer.applicableStyles.length > 0 && !offer.applicableStyles.includes(selectedStyle)) continue
      
      const discount = calculateDiscount(basePrice, offer)
      if (discount > bestDiscount) {
        bestDiscount = discount
        bestOffer = offer
      }
    }

    return {
      originalPrice: basePrice,
      discountAmount: bestDiscount,
      finalPrice: basePrice - bestDiscount,
      offer: bestOffer
    }
  }

  if (pricing.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <div className="text-6xl">💰</div>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No pricing data available
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Please contact admin to set up pricing.
        </p>
      </div>
    )
  }

  if (!selectedStyle || styles.length === 0) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-8">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
        <Select
          label="Art Style"
          value={selectedStyle}
          onChange={handleStyleChange}
          options={styles.map(style => ({ value: style, label: style }))}
        />
        
        <Select
          label="Number of People"
          value={selectedFaces.toString()}
          onChange={handleFacesChange}
          options={faceCounts.map(count => ({ 
            value: count.toString(), 
            label: count === 1 ? '1 Person' : `${count} People` 
          }))}
        />
      </div>

      {/* Pricing Cards */}
      {sizePricing.length > 0 ? (
        <div ref={containerRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {sizePricing.map((price, index) => {
            const priceData = getPriceWithOffer(price.basePrice)
            const isPopular = index === 1 // Middle option is popular

            return (
              <div
                key={`${price.style}-${price.size}-${price.numberOfFaces}`}
                className={`pricing-card relative p-8 rounded-2xl shadow-lg transition-all duration-300 hover:-translate-y-2 ${
                  isPopular
                    ? 'bg-primary-600 text-white scale-105 shadow-xl'
                    : 'bg-white dark:bg-gray-800 hover:shadow-xl'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className={`text-2xl font-bold mb-2 ${
                    isPopular ? 'text-white' : 'text-gray-900 dark:text-white'
                  }`}>
                    {price.size}
                  </h3>
                  <p className={`text-sm mb-4 ${
                    isPopular ? 'text-primary-100' : 'text-gray-600 dark:text-gray-300'
                  }`}>
                    {selectedStyle} • {selectedFaces} {selectedFaces === 1 ? 'Person' : 'People'}
                  </p>
                  
                  <div className="space-y-1">
                    {priceData.discountAmount > 0 ? (
                      <>
                        <div className="flex items-center justify-center space-x-2">
                          <span className={`text-3xl font-bold ${
                            isPopular ? 'text-white' : 'text-gray-900 dark:text-white'
                          }`}>
                            {formatPrice(priceData.finalPrice)}
                          </span>
                        </div>
                        <div className="flex items-center justify-center space-x-2">
                          <span className={`text-lg line-through ${
                            isPopular ? 'text-primary-200' : 'text-gray-500'
                          }`}>
                            {formatPrice(priceData.originalPrice)}
                          </span>
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">
                            Save {Math.round((priceData.discountAmount / priceData.originalPrice) * 100)}%
                          </span>
                        </div>
                        {priceData.offer && (
                          <p className={`text-xs ${
                            isPopular ? 'text-primary-200' : 'text-gray-500'
                          }`}>
                            {priceData.offer.title}
                          </p>
                        )}
                      </>
                    ) : (
                      <div className={`text-3xl font-bold ${
                        isPopular ? 'text-white' : 'text-gray-900 dark:text-white'
                      }`}>
                        {formatPrice(priceData.originalPrice)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {[
                    'Professional Artist',
                    'High Resolution Scan',
                    'Digital Delivery',
                    'Unlimited Revisions',
                    selectedStyle === 'Charcoal' ? 'Rich Texture & Depth' : 'Fine Line Detail'
                  ].map((feature) => (
                    <li key={feature} className="flex items-center space-x-3">
                      <Check className={`w-5 h-5 ${
                        isPopular ? 'text-primary-200' : 'text-green-500'
                      }`} />
                      <span className={`text-sm ${
                        isPopular ? 'text-primary-100' : 'text-gray-600 dark:text-gray-300'
                      }`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link href="/order">
                  <Button
                    className={`w-full ${
                      isPopular
                        ? 'bg-white text-primary-600 hover:bg-gray-100'
                        : ''
                    }`}
                    variant={isPopular ? 'default' : 'outline'}
                  >
                    Order Now
                  </Button>
                </Link>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <div className="text-6xl">💰</div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No pricing available
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Pricing for {selectedStyle} with {selectedFaces} {selectedFaces === 1 ? 'person' : 'people'} is not configured yet.
          </p>
        </div>
      )}

      {/* Active Offers Display */}
      {offers.filter(o => !o.couponCode).length > 0 && (
        <div className="mt-12 p-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-2xl">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            🎉 Active Offers
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {offers.filter(o => !o.couponCode).map((offer) => (
              <div key={offer.id} className="p-4 bg-white dark:bg-gray-800 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {offer.title}
                </h4>
                {offer.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {offer.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}