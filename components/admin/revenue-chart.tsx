'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

interface RevenueData {
  month: string
  revenue: number
}

export function RevenueChart() {
  const chartRef = useRef<HTMLDivElement>(null)
  const [revenueData, setRevenueData] = useState<RevenueData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const response = await fetch('/api/admin/revenue', {
          cache: 'no-store'
        })
        
        if (!response.ok) {
          throw new Error('Failed to fetch revenue data')
        }
        
        const data = await response.json()
        setRevenueData(data)
      } catch (err) {
        console.error('Error fetching revenue data:', err)
        setError('Failed to load revenue data')
        // Fallback to mock data if API fails
        setRevenueData([
          { month: 'Jan', revenue: 0 },
          { month: 'Feb', revenue: 0 },
          { month: 'Mar', revenue: 0 },
          { month: 'Apr', revenue: 0 },
          { month: 'May', revenue: 0 },
          { month: 'Jun', revenue: 0 },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchRevenueData()
  }, [])

  useEffect(() => {
    if (loading || revenueData.length === 0) return
    
    const chart = chartRef.current
    if (!chart) return

    const bars = chart.querySelectorAll('.revenue-bar')
    
    gsap.fromTo(
      bars,
      { scaleY: 0, transformOrigin: 'bottom' },
      { scaleY: 1, duration: 0.8, stagger: 0.1, ease: 'power2.out', delay: 0.3 }
    )
  }, [loading, revenueData])

  const maxRevenue = Math.max(...revenueData.map(d => d.revenue), 1) // Ensure at least 1 to avoid division by zero
  const totalRevenue = revenueData.reduce((sum, d) => sum + d.revenue, 0)

  if (loading) {
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
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Revenue Overview
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Monthly revenue for the last 6 months
        </p>
        {totalRevenue > 0 && (
          <p className="text-sm font-medium text-primary-600 dark:text-primary-400 mt-1">
            Total: ₹{totalRevenue.toLocaleString()}
          </p>
        )}
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400 mt-1">
            {error}
          </p>
        )}
      </div>

      <div ref={chartRef} className="space-y-4">
        {revenueData.map((data) => {
          const percentage = maxRevenue > 0 ? (data.revenue / maxRevenue) * 100 : 0

          return (
            <div key={data.month} className="flex items-center space-x-4">
              <div className="w-12 text-sm font-medium text-gray-600 dark:text-gray-400">
                {data.month}
              </div>
              
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-8 relative overflow-hidden">
                <div
                  className="revenue-bar h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-end pr-3"
                  style={{ width: `${Math.max(percentage, 2)}%` }} // Minimum 2% width for visibility
                >
                  {data.revenue > 0 && (
                    <span className="text-white text-xs font-medium">
                      ₹{data.revenue >= 1000 ? `${(data.revenue / 1000).toFixed(0)}k` : data.revenue.toFixed(0)}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="w-20 text-right text-sm text-gray-600 dark:text-gray-400">
                ₹{data.revenue.toLocaleString()}
              </div>
            </div>
          )
        })}
      </div>

      {totalRevenue === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p className="text-sm">No revenue data available for the selected period</p>
        </div>
      )}
    </div>
  )
}