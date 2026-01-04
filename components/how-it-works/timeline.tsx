'use client'

import { useRef } from 'react'
import { Clock, Calendar } from 'lucide-react'

const timelineEvents = [
  {
    time: 'Day 1',
    title: 'Order Received',
    description: 'Your order is confirmed and assigned to our best-matched artist.',
    duration: '< 1 hour',
  },
  {
    time: 'Day 1-2',
    title: 'Artist Review',
    description: 'Artist studies your photos and plans the portrait composition.',
    duration: '1-2 days',
  },
  {
    time: 'Day 2-4',
    title: 'Portrait Creation',
    description: 'Artist creates your portrait with meticulous attention to detail.',
    duration: '2-3 days',
  },
  {
    time: 'Day 4',
    title: 'Quality Check',
    description: 'Internal quality review ensures the portrait meets our standards.',
    duration: '< 1 day',
  },
  {
    time: 'Day 5',
    title: 'Preview Sent',
    description: 'High-quality preview sent to you for approval and feedback.',
    duration: '< 1 hour',
  },
  {
    time: 'Day 5-7',
    title: 'Revisions (if needed)',
    description: 'Artist makes any requested changes to perfect your portrait.',
    duration: '1-2 days',
  },
  {
    time: 'Day 7-10',
    title: 'Final Delivery',
    description: 'Approved portrait is printed and shipped to your address.',
    duration: '2-3 days',
  },
]

export default function ProcessTimeline() {
  const containerRef = useRef(null)

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-white dark:bg-gray-800 px-5 py-2.5 rounded-full mb-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="text-gray-700 dark:text-gray-300 font-semibold">7-10 Day Process</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white mb-6">
            Your Portrait Journey
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Every masterpiece follows our carefully crafted process
          </p>
        </div>

        <div ref={containerRef} className="relative">
          <div className="grid lg:grid-cols-2 gap-6">
            {timelineEvents.map((event, index) => (
              <div key={index} className="timeline-item group">
                <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 h-full">
                  {/* Step Number */}
                  <div className="flex items-center justify-end mb-4">
                    <span className="text-2xl font-bold text-gray-300 dark:text-gray-600">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Title and Time */}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {event.title}
                  </h3>
                  <div className="flex items-center space-x-4 mb-4 text-sm">
                    <span className="px-2.5 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg font-medium">
                      {event.time}
                    </span>
                    <div className="flex items-center text-gray-500 dark:text-gray-400">
                      <Clock className="w-4 h-4 mr-1.5" />
                      {event.duration}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {event.description}
                  </p>

                  {/* Hover Effect Indicator */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl transition-all duration-300 bg-blue-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Card */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Real-Time Updates
                </h4>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Receive WhatsApp notifications at every milestone and track your order status anytime through your personal dashboard. Timelines may vary based on artwork complexity and current demand.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}