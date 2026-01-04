'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { Check, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
  const [selectedStyle, setSelectedStyle] = useState<string>('')
  const containerRef = useRef<HTMLDivElement>(null)

  // Get unique styles
  const styles = Array.from(new Set(pricing.map(p => p.style)))

  // Set default style
  useEffect(() => {
    if (styles.length > 0 && !selectedStyle) {
      setSelectedStyle(styles[0])
    }
  }, [styles.length, selectedStyle])

  // Animation
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
        stagger: 0.1,
        ease: 'power2.out',
      }
    )
  }, [selectedStyle])

  // Calculate best offer for each price
  const getPriceWithOffer = (basePrice: number, style: string) => {
    let bestDiscount = 0
    let bestOffer: Offer | null = null

    for (const offer of offers) {
      if (offer.couponCode) continue // Skip coupon offers
      if (offer.minOrderValue && basePrice < offer.minOrderValue) continue
      if (offer.applicableStyles.length > 0 && !offer.applicableStyles.includes(style)) continue
      
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

  // Group pricing by style
  const pricingByStyle = pricing.reduce((acc, price) => {
    if (!acc[price.style]) {
      acc[price.style] = []
    }
    acc[price.style].push(price)
    return acc
  }, {} as Record<string, PricingItem[]>)

  // Sort sizes in a logical order
  const sizeOrder = ['8x10', '11x14', '16x20', '18x24']
  const sortPricing = (items: PricingItem[]) => {
    return items.sort((a, b) => {
      // First sort by number of faces
      if (a.numberOfFaces !== b.numberOfFaces) {
        return a.numberOfFaces - b.numberOfFaces
      }
      // Then sort by size
      const aIndex = sizeOrder.indexOf(a.size)
      const bIndex = sizeOrder.indexOf(b.size)
      return aIndex - bIndex
    })
  }

  return (
    <div className="space-y-16">
      {/* Style Tabs */}
      <div className="flex justify-center">
        <div className="inline-flex bg-gray-100 dark:bg-gray-800 rounded-2xl p-2">
          {styles.map((style) => (
            <button
              key={style}
              onClick={() => setSelectedStyle(style)}
              className={`px-8 py-3 rounded-xl font-medium transition-all duration-300 ${
                selectedStyle === style
                  ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              {style}
            </button>
          ))}
        </div>
      </div>

      {/* Pricing Grid */}
      <div ref={containerRef}>
        {selectedStyle && pricingByStyle[selectedStyle] && (
          <div className="space-y-12">
            {/* Group by number of faces */}
            {[1, 2, 3, 4, 5].map((faceCount) => {
              const facePricing = sortPricing(
                pricingByStyle[selectedStyle].filter(p => p.numberOfFaces === faceCount)
              )
              
              if (facePricing.length === 0) return null

              return (
                <div key={faceCount} className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {faceCount === 1 ? '1 Person' : `${faceCount} People`}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {selectedStyle} portraits for {faceCount === 1 ? 'individual' : 'group'} sessions
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                    {facePricing.map((price, index) => {
                      const priceData = getPriceWithOffer(price.basePrice, price.style)
                      const isPopular = index === 1 && facePricing.length > 2 // Second option if multiple

                      return (
                        <div
                          key={`${price.style}-${price.size}-${price.numberOfFaces}`}
                          className={`pricing-card relative p-6 rounded-2xl shadow-lg transition-all duration-300 hover:-translate-y-1 ${
                            isPopular
                              ? 'bg-primary-600 text-white scale-105 shadow-xl ring-2 ring-primary-200'
                              : 'bg-white dark:bg-gray-800 hover:shadow-xl'
                          }`}
                        >
                          {isPopular && (
                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                              <div className="flex items-center bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-semibold">
                                <Star className="w-3 h-3 mr-1 fill-current" />
                                Popular
                              </div>
                            </div>
                          )}

                          <div className="text-center mb-6">
                            <h4 className={`text-xl font-bold mb-2 ${
                              isPopular ? 'text-white' : 'text-gray-900 dark:text-white'
                            }`}>
                              {price.size}
                            </h4>
                            
                            <div className="space-y-1">
                              {priceData.discountAmount > 0 ? (
                                <>
                                  <div className={`text-2xl font-bold ${
                                    isPopular ? 'text-white' : 'text-gray-900 dark:text-white'
                                  }`}>
                                    {formatPrice(priceData.finalPrice)}
                                  </div>
                                  <div className="flex items-center justify-center space-x-2">
                                    <span className={`text-sm line-through ${
                                      isPopular ? 'text-primary-200' : 'text-gray-500'
                                    }`}>
                                      {formatPrice(priceData.originalPrice)}
                                    </span>
                                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">
                                      Save {Math.round((priceData.discountAmount / priceData.originalPrice) * 100)}%
                                    </span>
                                  </div>
                                </>
                              ) : (
                                <div className={`text-2xl font-bold ${
                                  isPopular ? 'text-white' : 'text-gray-900 dark:text-white'
                                }`}>
                                  {formatPrice(priceData.originalPrice)}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Features */}
                          <ul className="space-y-2 mb-6">
                            {[
                              'Professional Artist',
                              'High Resolution',
                              'Digital Delivery',
                              'Quality Guarantee'
                            ].map((feature) => (
                              <li key={feature} className="flex items-center space-x-2">
                                <Check className={`w-4 h-4 ${
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
                              size="sm"
                            >
                              Order Now
                            </Button>
                          </Link>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Active Offers Display */}
      {offers.filter(o => !o.couponCode).length > 0 && (
        <div className="mt-16 p-8 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-2xl">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              🎉 Special Offers
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Limited time discounts automatically applied to eligible orders
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {offers.filter(o => !o.couponCode).map((offer) => (
              <div key={offer.id} className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                <h4 className="font-semibold text-gray-900 dark:text-white text-lg mb-2">
                  {offer.title}
                </h4>
                {offer.description && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
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