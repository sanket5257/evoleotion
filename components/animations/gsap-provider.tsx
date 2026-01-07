'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export function GSAPProvider({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false)
  const initialized = useRef(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient || initialized.current) return

    try {
      // Register plugins only on client
      if (typeof window !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger)
        
        // Set default GSAP settings
        gsap.defaults({
          duration: 0.8,
          ease: 'power2.out',
        })

        // Configure ScrollTrigger to work with Lenis
        ScrollTrigger.config({
          autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load',
          ignoreMobileResize: true
        })

        // Wait for Lenis to be available and configure ScrollTrigger
        const configureLenis = () => {
          const lenis = (window as any).lenis
          if (lenis) {
            // Update ScrollTrigger on Lenis scroll
            lenis.on('scroll', ScrollTrigger.update)
            
            // Configure ScrollTrigger to use Lenis
            gsap.ticker.add((time) => {
              lenis.raf(time * 1000)
            })
            
            gsap.ticker.lagSmoothing(0)
          } else {
            // Retry if Lenis isn't ready yet
            setTimeout(configureLenis, 100)
          }
        }

        configureLenis()
        initialized.current = true
      }
    } catch (error) {
      console.error('GSAP initialization error:', error)
    }

    return () => {
      try {
        // Clean up ScrollTrigger instances
        ScrollTrigger.getAll().forEach(trigger => {
          try {
            trigger.kill()
          } catch (e) {
            console.warn('Error killing ScrollTrigger:', e)
          }
        })
        
        // Clean up Lenis integration
        const lenis = (window as any).lenis
        if (lenis) {
          lenis.off('scroll', ScrollTrigger.update)
        }
      } catch (error) {
        console.warn('ScrollTrigger cleanup error:', error)
      }
    }
  }, [isClient])

  // Refresh ScrollTrigger on route changes (client-side only)
  useEffect(() => {
    if (!isClient || !initialized.current) return

    const refreshScrollTrigger = () => {
      try {
        ScrollTrigger.refresh()
      } catch (error) {
        console.warn('ScrollTrigger refresh error:', error)
      }
    }

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(refreshScrollTrigger, 100)
    
    return () => clearTimeout(timeoutId)
  }, [isClient])

  return <>{children}</>
}