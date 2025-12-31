'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { CheckCircle, MessageCircle, Copy, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'

interface OrderSuccessProps {
  orderNumber: string
  finalPrice: number
  whatsappUrl: string
}

export function OrderSuccess({ orderNumber, finalPrice, whatsappUrl }: OrderSuccessProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Animation sequence
    const tl = gsap.timeline()
    
    tl.fromTo(
      container.querySelector('.success-icon'),
      { scale: 0, rotation: -180 },
      { scale: 1, rotation: 0, duration: 0.6, ease: 'back.out(1.7)' }
    )
    .fromTo(
      container.querySelector('.success-content'),
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
      '-=0.3'
    )
    .fromTo(
      container.querySelector('.action-buttons'),
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' },
      '-=0.2'
    )
  }, [])

  const copyOrderNumber = () => {
    navigator.clipboard.writeText(orderNumber)
    // You could add a toast notification here
  }

  const redirectToWhatsApp = () => {
    window.open(whatsappUrl, '_blank')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12">
      <div ref={containerRef} className="max-w-2xl mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-12 shadow-xl text-center">
          {/* Success Icon */}
          <div className="success-icon mb-8">
            <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
            </div>
          </div>

          {/* Success Content */}
          <div className="success-content space-y-6">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Order Placed Successfully!
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Thank you for choosing our portrait service. Your order has been received 
              and our artists will start working on your masterpiece.
            </p>

            {/* Order Details */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Order Number:</span>
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-bold text-primary-600 dark:text-primary-400">
                    {orderNumber}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyOrderNumber}
                    className="h-8 w-8 p-0"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Total Amount:</span>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatPrice(finalPrice)}
                </span>
              </div>
            </div>

            {/* Next Steps */}
            <div className="text-left bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6">
              <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-3">
                What happens next?
              </h3>
              <ol className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                <li className="flex items-start space-x-2">
                  <span className="font-bold">1.</span>
                  <span>Click the WhatsApp button below to share payment details</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="font-bold">2.</span>
                  <span>Our team will confirm your order and payment</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="font-bold">3.</span>
                  <span>Artists will create your portrait (3-5 business days)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="font-bold">4.</span>
                  <span>We'll send you a preview for approval</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="font-bold">5.</span>
                  <span>Final artwork delivered to your doorstep</span>
                </li>
              </ol>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons flex flex-col sm:flex-row gap-4 mt-8">
            <Button
              onClick={redirectToWhatsApp}
              size="lg"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white flex items-center justify-center space-x-2"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Continue on WhatsApp</span>
            </Button>
            
            <Link href="/" className="flex-1">
              <Button variant="outline" size="lg" className="w-full flex items-center justify-center space-x-2">
                <Home className="w-5 h-5" />
                <span>Back to Home</span>
              </Button>
            </Link>
          </div>

          {/* Support Info */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Need help? Contact us at{' '}
              <a href="mailto:support@portraitstudio.com" className="text-primary-600 hover:underline">
                support@portraitstudio.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}