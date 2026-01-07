'use client'

import { useEffect, useState } from 'react'
import Lenis from 'lenis'

export function useLenis() {
  const [lenis, setLenis] = useState<Lenis | null>(null)

  useEffect(() => {
    // Get the Lenis instance from the global scope
    // This assumes Lenis is attached to window in the provider
    const lenisInstance = (window as any).lenis
    if (lenisInstance) {
      setLenis(lenisInstance)
    }
  }, [])

  return lenis
}

// Utility functions for smooth scrolling
export const scrollTo = (target: string | number, options?: any) => {
  const lenis = (window as any).lenis
  if (lenis) {
    lenis.scrollTo(target, options)
  }
}

export const scrollToTop = () => {
  scrollTo(0, { duration: 1.5 })
}

export const scrollToElement = (selector: string) => {
  scrollTo(selector, { offset: -100 })
}