'use client'

import { useState } from 'react'
import { Eye, Package, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'

interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone: string
  style: string
  size: string
  numberOfFaces: number
  basePrice: number
  framePrice: number
  discountAmount: number
  finalPrice: number
  status: string
  paymentStatus: string
  specialNotes?: string | null
  previewUrl?: string | null
  createdAt: Date
  frame?: { name: string } | null
  offer?: { title: string } | null
  images: { id: string; imageUrl: string }[]
}

interface UserOrdersProps {
  orders: Order[]
}

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  PREVIEW_SENT: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  REVISION: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  APPROVED: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  COMPLETED: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
}

const paymentStatusColors = {
  PENDING: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  PAID: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  REFUNDED: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
}

const statusIcons = {
  PENDING: Clock,
  PREVIEW_SENT: Eye,
  REVISION: AlertCircle,
  APPROVED: CheckCircle,
  COMPLETED: Package,
}

const statusDescriptions = {
  PENDING: 'Your order is being processed by our artists',
  PREVIEW_SENT: 'Preview has been sent to your email for review',
  REVISION: 'We are working on the requested changes',
  APPROVED: 'Your portrait is approved and being finalized',
  COMPLETED: 'Your portrait is ready! Check your email for details',
}

export function UserOrders({ orders }: UserOrdersProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  if (orders.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No orders yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Ready to create your first custom portrait?
          </p>
          <a
            href="/order"
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Start Your Order
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        {orders.map((order) => {
          const StatusIcon = statusIcons[order.status as keyof typeof statusIcons]
          
          return (
            <div
              key={order.id}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Order #{order.orderNumber}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {formatPrice(order.finalPrice)}
                  </p>
                  {order.discountAmount > 0 && (
                    <p className="text-sm text-green-600 dark:text-green-400">
                      Saved {formatPrice(order.discountAmount)}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Order Details</h4>
                  <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <p><span className="font-medium">Style:</span> {order.style}</p>
                    <p><span className="font-medium">Size:</span> {order.size}</p>
                    <p><span className="font-medium">People:</span> {order.numberOfFaces}</p>
                    {order.frame && (
                      <p><span className="font-medium">Frame:</span> {order.frame.name}</p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Status</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <StatusIcon className="w-4 h-4" />
                      <Badge className={statusColors[order.status as keyof typeof statusColors]}>
                        {order.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {statusDescriptions[order.status as keyof typeof statusDescriptions]}
                    </p>
                    <Badge className={paymentStatusColors[order.paymentStatus as keyof typeof paymentStatusColors]}>
                      Payment: {order.paymentStatus}
                    </Badge>
                  </div>
                </div>
              </div>

              {order.previewUrl && (
                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
                    🎨 Your preview is ready!
                  </p>
                  <a
                    href={order.previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 underline"
                  >
                    View Preview
                  </a>
                </div>
              )}

              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedOrder(order)}
                  className="flex items-center space-x-1"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Details</span>
                </Button>

                {order.status === 'PREVIEW_SENT' && (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Please check your email to approve or request changes
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Order #{selectedOrder.orderNumber}
                </h3>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedOrder(null)}
                >
                  ✕
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold">Order Information</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Style:</strong> {selectedOrder.style}</p>
                    <p><strong>Size:</strong> {selectedOrder.size}</p>
                    <p><strong>Number of People:</strong> {selectedOrder.numberOfFaces}</p>
                    {selectedOrder.frame && <p><strong>Frame:</strong> {selectedOrder.frame.name}</p>}
                    {selectedOrder.offer && <p><strong>Offer Applied:</strong> {selectedOrder.offer.title}</p>}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-semibold">Pricing Breakdown</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Base Price:</span>
                      <span>{formatPrice(selectedOrder.basePrice)}</span>
                    </div>
                    {selectedOrder.framePrice > 0 && (
                      <div className="flex justify-between">
                        <span>Frame:</span>
                        <span>{formatPrice(selectedOrder.framePrice)}</span>
                      </div>
                    )}
                    {selectedOrder.discountAmount > 0 && (
                      <div className="flex justify-between text-green-600 dark:text-green-400">
                        <span>Discount:</span>
                        <span>-{formatPrice(selectedOrder.discountAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-semibold text-lg border-t pt-2">
                      <span>Total:</span>
                      <span>{formatPrice(selectedOrder.finalPrice)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {selectedOrder.specialNotes && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-2">Your Notes</h4>
                  <p className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-3 rounded">
                    {selectedOrder.specialNotes}
                  </p>
                </div>
              )}

              {selectedOrder.images.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-4">Your Photos</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {selectedOrder.images.map((image) => (
                      <img
                        key={image.id}
                        src={image.imageUrl}
                        alt="Your uploaded photo"
                        className="w-full h-24 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              )}

              {selectedOrder.previewUrl && (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
                    Preview Available
                  </h4>
                  <p className="text-blue-700 dark:text-blue-300 mb-3">
                    Your portrait preview is ready for review!
                  </p>
                  <a
                    href={selectedOrder.previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    View Preview
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}