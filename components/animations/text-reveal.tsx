'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface TextRevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

export function TextReveal({ children, className, delay = 0 }: TextRevealProps) {
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = textRef.current
    if (!element) return

    // Split text into words
    const text = element.textContent || ''
    const words = text.split(' ')
    
    element.innerHTML = words
      .map(word => `<span class="inline-block overflow-hidden"><span class="inline-block">${word}</span></span>`)
      .join(' ')

    const wordSpans = element.querySelectorAll('span span')

    // Initial state
    gsap.set(wordSpans, { y: '100%' })

    // Animate in
    gsap.to(wordSpans, {
      y: '0%',
      duration: 0.8,
      ease: 'power2.out',
      stagger: 0.05,
      delay,
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    })
  }, [delay])

  return (
    <div ref={textRef} className={className}>
      {children}
    </div>
  )
}