'use client'

import { useEffect, useRef } from 'react'
import { Navbar } from '@/components/layout/navbar'

export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      video.play().catch((error) => {
        console.log('Auto-play failed:', error)
        // Auto-play failed, but that's okay - user can click to play
      })
    }
  }, [])

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Video */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        onError={(e) => console.error('Video error:', e)}
      >
        <source src="/videos/663bd1303af50b30413aaa1f_Hero with Post-transcode.mp4" type="video/mp4" />
        <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
          <p className="text-white/60">Video not supported</p>
        </div>
      </video>
      
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