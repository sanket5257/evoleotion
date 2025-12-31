'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Clock, CheckCircle } from 'lucide-react'

const timelineEvents = [
  {
    time: 'Day 1',
    title: 'Order Received',
    description: 'Your order is confirmed and assigned to our best-matched artist.',
    status: 'completed',
  },
  {
    time: 'Day 1-2',
    title: 'Artist Review',
    description: 'Artist studies your photos and plans the portrait composition.',
    status: 'completed',
  },
  {
    time: 'Day 2-4',
    title: 'Portrait Creation',
    description: 'Artist creates your portrait with meticulous attention to detail.',
    status: 'in-progress',
  },
  {
    time: 'Day 4',
    title: 'Quality Check',
    description: 'Internal quality review ensures the portrait meets our standards.',
    status: 'pending',
  },
  {
    time: 'Day 5',
    title: 'Preview Sent',
    description: 'High-quality preview sent to you for approval and feedback.',
    status: 'pending',
  },
  {
    time: 'Day 5-7',
    title: 'Revisions (if needed)',
    description: 'Artist makes any requested changes to perfect your portrait.',
    status: 'pending',
  },
  {
    time: 'Day 7-10',
    title: 'Final Delivery',
    description: 'Approved portrait is printed and shipped to your address.',
    status: 'pending',
  },
]

export function ProcessTimeline() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const items = container.querySelectorAll('.timeline-item')
    
    gsap.fromTo(
      items,
      {
        x: -50,
        opacity: 0,
      },
      {
        x: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: container,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      }
    )
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400'
      case 'in-progress':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400'
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5" />
      case 'in-progress':
        return <Clock className="w-5 h-5 animate-pulse" />
      default:
        return <Clock className="w-5 h-5" />
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Typical Timeline
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Here's what happens from order to delivery
        </p>
      </div>

      <div ref={containerRef} className="relative">
        {/* Timeline Line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
        
        <div className="space-y-8">
          {timelineEvents.map((event, index) => (
            <div key={index} className="timeline-item relative flex items-start space-x-6">
              {/* Timeline Dot */}
              <div className={`relative z-10 flex items-center justify-center w-16 h-16 rounded-full ${getStatusColor(event.status)}`}>
                {getStatusIcon(event.status)}
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {event.title}
                  </h3>
                  <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium">
                    {event.time}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {event.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>Note:</strong> Timeline may vary based on complexity and current order volume. 
          We'll keep you updated throughout the process via WhatsApp.
        </p>
      </div>
    </div>
  )
}