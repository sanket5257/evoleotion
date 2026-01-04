'use client'

import { useState, useRef, useEffect } from 'react'

interface VideoLoaderProps {
  src: string
  className?: string
  autoPlay?: boolean
  muted?: boolean
  loop?: boolean
  playsInline?: boolean
}

export function VideoLoader({ 
  src, 
  className = '', 
  autoPlay = false, 
  muted = true, 
  loop = false, 
  playsInline = true 
}: VideoLoaderProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (video && autoPlay) {
      video.play().catch(() => {
        // Auto-play failed, but that's okay
      })
    }
  }, [autoPlay])

  const handleLoadedData = () => {
    setIsLoading(false)
    if (autoPlay && videoRef.current) {
      videoRef.current.play().catch(() => {
        // Auto-play failed, but that's okay
      })
    }
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
    console.error('Video failed to load:', src)
  }

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 bg-gray-900 flex items-center justify-center z-10">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      )}
      
      {hasError ? (
        <div className="absolute inset-0 bg-gray-900 flex items-center justify-center z-10">
          <p className="text-white/60 text-sm">Video unavailable</p>
        </div>
      ) : (
        <video
          ref={videoRef}
          className={className}
          autoPlay={autoPlay}
          muted={muted}
          loop={loop}
          playsInline={playsInline}
          onLoadedData={handleLoadedData}
          onError={handleError}
          onCanPlay={handleLoadedData}
        >
          <source src={src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  )
}