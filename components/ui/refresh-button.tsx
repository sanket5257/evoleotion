'use client'

interface RefreshButtonProps {
  children: React.ReactNode
  className?: string
}

export function RefreshButton({ children, className = '' }: RefreshButtonProps) {
  const handleRefresh = () => {
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleRefresh()
        }
      }}
      onClick={handleRefresh}
      className={`cursor-pointer ${className}`}
    >
      {children}
    </div>
  )
}