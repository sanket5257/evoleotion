'use client'

import { useEffect, useRef, useState } from 'react'
import { Navbar } from '@/components/layout/navbar'

export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoError, setVideoError] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    const video = videoRef.current
    if (video) {
      const playVideo = async () => {
        try {
          await video.play()
        } catch (error) {
          console.log('Auto-play failed:', error)
          // Auto-play failed, but that's okay - user can click to play
        }
      }

      // Small delay to ensure video is loaded
      const timeoutId = setTimeout(playVideo, 100)
      
      return () => clearTimeout(timeoutId)
    }
  }, [isClient])

  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error('Video error:', e)
    setVideoError(true)
  }

  const handleVideoLoad = () => {
    setVideoError(false)
  }

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Video or Fallback */}
      {videoError ? (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white/60">Loading experience...</p>
          </div>
        </div>
      ) : (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          onError={handleVideoError}
          onLoadedData={handleVideoLoad}
          onCanPlay={handleVideoLoad}
        >
          <source src="/videos/663bd1303af50b30413aaa1f_Hero with Post-transcode.mp4" type="video/mp4" />
          <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
            <p className="text-white/60">Video not supported</p>
          </div>
        </video>
      )}
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Navigation */}
      <Navbar />
      
      {/* Hero Content */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="text-center">
          <h1 className="text-6xl md:text-8xl font-light tracking-wider mb-4">
            Portraits
          </h1>
          <p className="text-lg tracking-widest uppercase opacity-80">
            Pencil & Charcoal Art Studio
          </p>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="w-px h-16 bg-white/50 animate-pulse" />
      </div>
    </section>
  )
}