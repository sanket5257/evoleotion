'use client'

import { useState, useEffect } from 'react'
import { ArrowUp } from 'lucide-react'
import { scrollToTop } from '@/hooks/use-lenis'

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  return (
    <button
      className={`
        fixed bottom-8 right-8 z-50 p-3 rounded-full 
        bg-white/10 backdrop-blur-md border border-white/20
        text-white hover:bg-white/20 transition-all duration-300
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
      `}
      onClick={scrollToTop}
      aria-label="Scroll to top"
    >
      <ArrowUp size={20} />
    </button>
  )
}