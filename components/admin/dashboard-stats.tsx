'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ShoppingCart, Clock, DollarSign, Tag, Users } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

interface DashboardStatsProps {
  totalOrders: number
  pendingOrders: number
  totalRevenue: number
  activeOffers: number
  totalUsers: number
}

const stats = [
  {
    name: 'Total Orders',
    icon: ShoppingCart,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
  },
  {
    name: 'Pending Orders',
    icon: Clock,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
  },
  {
    name: 'Total Revenue',
    icon: DollarSign,
    color: 'text-green-600',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
  },
  {
    name: 'Active Offers',
    icon: Tag,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
  },
  {
    name: 'Total Users',
    icon: Users,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100 dark:bg-indigo-900/30',
  },
]

export function DashboardStats({ totalOrders, pendingOrders, totalRevenue, activeOffers, totalUsers }: DashboardStatsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const values = [totalOrders, pendingOrders, totalRevenue, activeOffers, totalUsers]

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const cards = container.querySelectorAll('.stat-card')
    
    gsap.fromTo(
      cards,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out' }
    )
  }, [])

  return (
    <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        const value = values[index]
        const displayValue = stat.name === 'Total Revenue' ? formatPrice(value) : value.toLocaleString()

        return (
          <div
            key={stat.name}
            className="stat-card bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.name}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {displayValue}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}