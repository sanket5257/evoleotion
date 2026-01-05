'use client'

import { X } from 'lucide-react'

interface RemoveButtonProps {
  onRemove: () => void
  className?: string
}

export function RemoveButton({ onRemove, className = '' }: RemoveButtonProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onRemove()
        }
      }}
      onClick={onRemove}
      className={`cursor-pointer ${className}`}
    >
      <X className="w-4 h-4" />
    </div>
  )
}