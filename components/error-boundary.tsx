'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    // In production, you might want to log this to an error reporting service
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      // Example: Send to error reporting service
      // errorReportingService.captureException(error, { extra: errorInfo })
    }
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-light">Something went wrong</h2>
            <p className="text-gray-400">Please refresh the page to try again</p>
            <div
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  this.setState({ hasError: false, error: undefined })
                  if (typeof window !== 'undefined') {
                    window.location.reload()
                  }
                }
              }}
              onMouseDown={() => {
                this.setState({ hasError: false, error: undefined })
                if (typeof window !== 'undefined') {
                  window.location.reload()
                }
              }}
              className="px-6 py-2 border border-white/30 hover:bg-white hover:text-black transition-colors cursor-pointer"
            >
              Refresh Page
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}