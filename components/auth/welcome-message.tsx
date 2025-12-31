'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface WelcomeMessageProps {
  userName: string
  onClose: () => void
}

export function WelcomeMessage({ userName, onClose }: WelcomeMessageProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full transform transition-all duration-300 ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome to PortraitStudio!
          </h2>
          
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Hi {userName}! Your account has been created successfully. 
            You can now place orders and track them in your dashboard.
          </p>
          
          <div className="space-y-3">
            <Button
              onClick={onClose}
              className="w-full flex items-center justify-center space-x-2"
            >
              <span>Start Creating</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
            
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Ready to create your first custom portrait?
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}