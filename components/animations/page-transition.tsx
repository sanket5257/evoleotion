'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

interface PageTransitionProps {
  children: React.ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Initial state
    gsap.set(container, { opacity: 0, y: 20 })

    // Animate in
    gsap.to(container, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out',
    })
  }, [])

  return (
    <div ref={containerRef} className="min-h-screen">
      {children}
    </div>
  )
}