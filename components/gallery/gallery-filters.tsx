'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface GalleryFiltersProps {
  styles: string[]
}

export function GalleryFilters({ styles }: GalleryFiltersProps) {
  const [activeFilter, setActiveFilter] = useState<string | null>(null)

  const handleFilterChange = (style: string | null) => {
    setActiveFilter(style)
    
    // Dispatch custom event for gallery grid to listen to
    const event = new CustomEvent('gallery-filter-change', {
      detail: { style }
    })
    window.dispatchEvent(event)
  }

  return (
    <div className="flex flex-wrap justify-center gap-3 mb-12">
      <Button
        variant={activeFilter === null ? 'default' : 'outline'}
        onClick={() => handleFilterChange(null)}
        className="rounded-full"
      >
        All Styles
      </Button>
      
      {styles.map((style) => (
        <Button
          key={style}
          variant={activeFilter === style ? 'default' : 'outline'}
          onClick={() => handleFilterChange(style)}
          className="rounded-full"
        >
          {style}
        </Button>
      ))}
    </div>
  )
}