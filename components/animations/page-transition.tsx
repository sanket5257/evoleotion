'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

interface PageTransitionProps {
  children: React.ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    const container = containerRef.current
    if (!container) return

    try {
      // Initial state
      gsap.set(container, { opacity: 0, y: 20 })

      // Animate in
      gsap.to(container, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
      })
    } catch (error) {
      console.error('Page transition animation error:', error)
      // Fallback: ensure content is visible
      if (container) {
        container.style.opacity = '1'
        container.style.transform = 'translateY(0)'
      }
    }
  }, [isClient])

  return (
    <div 
      ref={containerRef} 
      className="min-h-screen"
      style={!isClient ? { opacity: 1 } : undefined}
    >
      {children}
    </div>
  )
}