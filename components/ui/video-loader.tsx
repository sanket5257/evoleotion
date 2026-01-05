'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

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
  const [isClient, setIsClient] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleLoadedData = useCallback(() => {
    setIsLoading(false)
    setHasError(false)
    
    if (autoPlay && videoRef.current && isClient) {
      videoRef.current.play().catch((error) => {
        console.log('Auto-play failed:', error)
        // Auto-play failed, but that's okay
      })
    }
  }, [autoPlay, isClient])

  const handleError = useCallback(() => {
    setIsLoading(false)
    setHasError(true)
    console.error('Video failed to load:', src)
  }, [src])

  const handleCanPlay = useCallback(() => {
    setIsLoading(false)
    setHasError(false)
  }, [])

  useEffect(() => {
    if (!isClient) return

    // Set a timeout to handle cases where video never loads
    timeoutRef.current = setTimeout(() => {
      if (isLoading) {
        setHasError(true)
        setIsLoading(false)
      }
    }, 10000) // 10 second timeout

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [isClient, isLoading])

  // Don't render video until client-side
  if (!isClient) {
    return (
      <div className="relative w-full h-full">
        <div className="absolute inset-0 bg-gray-900 flex items-center justify-center z-10">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      </div>
    )
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
          onCanPlay={handleCanPlay}
          preload="metadata"
        >
          <source src={src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  )
}