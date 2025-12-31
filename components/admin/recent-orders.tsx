'use client'

import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

interface Order {
  id: string
  orderNumber: string
  customerName: string
  finalPrice: number
  status: string
  createdAt: Date
  user?: {
    name: string | null
    email: string
  } | null
}

interface RecentOrdersProps {
  orders: Order[]
}

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  PREVIEW_SENT: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  REVISION: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  APPROVED: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  COMPLETED: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
}

export function RecentOrders({ orders }: RecentOrdersProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Recent Orders
        </h3>
        <Link
          href="/admin/orders"
          className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
        >
          View all
        </Link>
      </div>

      <div className="space-y-4">
        {orders.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            No orders yet
          </p>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {order.orderNumber}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {order.customerName}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {formatPrice(order.finalPrice)}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                
                <Badge className={statusColors[order.status as keyof typeof statusColors]}>
                  {order.status.replace('_', ' ')}
                </Badge>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}