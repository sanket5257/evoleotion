'use client'

import { useState, useEffect } from 'react'
import { X, Megaphone } from 'lucide-react'

interface BannerData {
  title: string
  text: string
  active: boolean
}

export function PromotionalBanner() {
  const [banner, setBanner] = useState<BannerData | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await fetch('/api/banner', {
          cache: 'no-store'
        })
        
        if (response.ok) {
          const bannerData = await response.json()
          if (bannerData && bannerData.active) {
            setBanner(bannerData)
            
            // Check if user has dismissed this banner
            const dismissedBanners = JSON.parse(localStorage.getItem('dismissedBanners') || '[]')
            const bannerKey = `${bannerData.title}-${bannerData.text}`
            
            if (!dismissedBanners.includes(bannerKey)) {
              setIsVisible(true)
            }
          }
        }
      } catch (error) {
        console.error('Error fetching banner:', error)
      }
    }

    fetchBanner()
  }, [])

  const handleDismiss = () => {
    if (banner) {
      const bannerKey = `${banner.title}-${banner.text}`
      const dismissedBanners = JSON.parse(localStorage.getItem('dismissedBanners') || '[]')
      dismissedBanners.push(bannerKey)
      localStorage.setItem('dismissedBanners', JSON.stringify(dismissedBanners))
    }
    
    setIsVisible(false)
    setIsDismissed(true)
  }

  if (!banner || !isVisible || isDismissed) {
    return null
  }

  return (
    <div className="relative bg-gradient-to-r from-primary-600 to-primary-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1">
            <Megaphone className="w-5 h-5 flex-shrink-0" />
            <div className="text-center flex-1">
              <span className="font-semibold">{banner.title}</span>
              {banner.text && (
                <span className="ml-2 text-primary-100">{banner.text}</span>
              )}
            </div>
          </div>
          
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 p-1 hover:bg-white/10 rounded-full transition-colors"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}