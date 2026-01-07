'use client'

import { ReactNode } from 'react'
import { scrollTo } from '@/hooks/use-lenis'

interface SmoothLinkProps {
  href: string
  children: ReactNode
  className?: string
  offset?: number
  duration?: number
  onClick?: () => void
}

export function SmoothLink({ 
  href, 
  children, 
  className = '', 
  offset = -100, 
  duration = 1.2,
  onClick 
}: SmoothLinkProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    
    // Handle external links
    if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) {
      window.open(href, '_blank')
      return
    }
    
    // Handle anchor links
    if (href.startsWith('#')) {
      scrollTo(href, { offset, duration })
    } else {
      // Handle internal navigation
      window.location.href = href
    }
    
    onClick?.()
  }

  return (
    <a 
      href={href} 
      className={className}
      onClick={handleClick}
    >
      {children}
    </a>
  )
}