'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

// Mock data - in real app, this would come from actual revenue data
const revenueData = [
  { month: 'Jan', revenue: 45000 },
  { month: 'Feb', revenue: 52000 },
  { month: 'Mar', revenue: 48000 },
  { month: 'Apr', revenue: 61000 },
  { month: 'May', revenue: 55000 },
  { month: 'Jun', revenue: 67000 },
]

export function RevenueChart() {
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const chart = chartRef.current
    if (!chart) return

    const bars = chart.querySelectorAll('.revenue-bar')
    
    gsap.fromTo(
      bars,
      { scaleY: 0, transformOrigin: 'bottom' },
      { scaleY: 1, duration: 0.8, stagger: 0.1, ease: 'power2.out', delay: 0.3 }
    )
  }, [])

  const maxRevenue = Math.max(...revenueData.map(d => d.revenue))

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Revenue Overview
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Monthly revenue for the last 6 months
        </p>
      </div>

      <div ref={chartRef} className="space-y-4">
        {revenueData.map((data) => {
          const percentage = (data.revenue / maxRevenue) * 100

          return (
            <div key={data.month} className="flex items-center space-x-4">
              <div className="w-12 text-sm font-medium text-gray-600 dark:text-gray-400">
                {data.month}
              </div>
              
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-8 relative overflow-hidden">
                <div
                  className="revenue-bar h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-end pr-3"
                  style={{ width: `${percentage}%` }}
                >
                  <span className="text-white text-xs font-medium">
                    ₹{(data.revenue / 1000).toFixed(0)}k
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}