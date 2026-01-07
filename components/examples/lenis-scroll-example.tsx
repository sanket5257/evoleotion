'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export function LenisScrollExample() {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || !textRef.current) return

    // Create scroll-triggered animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1,
        markers: false, // Set to true for debugging
      }
    })

    tl.fromTo(textRef.current, 
      { 
        opacity: 0, 
        y: 50 
      },
      { 
        opacity: 1, 
        y: 0, 
        duration: 1 
      }
    )

    return () => {
      tl.kill()
    }
  }, [])

  return (
    <div 
      ref={containerRef}
      className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black"
    >
      <div 
        ref={textRef}
        className="text-center"
      >
        <h2 className="text-4xl md:text-6xl font-script text-white mb-4">
          Smooth Scrolling
        </h2>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          This text animates smoothly as you scroll, powered by Lenis smooth scrolling 
          and GSAP ScrollTrigger working together seamlessly.
        </p>
      </div>
    </div>
  )
}