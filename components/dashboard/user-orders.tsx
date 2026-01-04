'use client'

import { useState } from 'react'
import { Eye, Package, Clock, CheckCircle, AlertCircle, X } from 'lucide-react'
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
  discountAmount: number
  finalPrice: number
  status: string
  paymentStatus: string
  specialNotes?: string | null
  previewUrl?: string | null
  createdAt: Date
  offer?: { title: string } | null
  images: { id: string; imageUrl: string }[]
}

interface UserOrdersProps {
  orders: Order[]
}

const statusColors = {
  PENDING: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
  PREVIEW_SENT: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  REVISION: 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
  APPROVED: 'bg-green-500/20 text-green-400 border border-green-500/30',
  COMPLETED: 'bg-gray-500/20 text-gray-400 border border-gray-500/30',
}

const paymentStatusColors = {
  PENDING: 'bg-red-500/20 text-red-400 border border-red-500/30',
  PAID: 'bg-green-500/20 text-green-400 border border-green-500/30',
  REFUNDED: 'bg-gray-500/20 text-gray-400 border border-gray-500/30',
}

const statusIcons = {
  PENDING: Clock,
  PREVIEW_SENT: Eye,
  REVISION: AlertCircle,
  APPROVED: CheckCircle,
  COMPLETED: Package,
}

const statusDescriptions = {
  PENDING: 'Your sketch order is being processed by our artists',
  PREVIEW_SENT: 'Preview has been sent to your email for review',
  REVISION: 'We are working on the requested changes',
  APPROVED: 'Your sketch is approved and being finalized',
  COMPLETED: 'Your sketch is ready! Check your email for details',
}

export function UserOrders({ orders }: UserOrdersProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  if (orders.length === 0) {
    return (
      <div className="text-center py-24">
        <div className="border border-white/10 p-12 max-w-md mx-auto">
          <div className="w-20 h-20 mx-auto mb-8 border border-white/20 rounded-full flex items-center justify-center">
            <Package className="w-10 h-10 text-white/60" />
          </div>
          <h3 className="text-2xl font-light tracking-wide text-white mb-4">
            No Orders Yet
          </h3>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Ready to create your first custom pencil or charcoal sketch portrait?
          </p>
          <a
            href="/order"
            className="inline-block px-8 py-3 bg-white text-black text-sm uppercase tracking-widest hover:bg-gray-200 transition-colors duration-300"
          >
            Start Your Order
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Orders Grid */}
      <div className="grid gap-8">
        {orders.map((order) => {
          const StatusIcon = statusIcons[order.status as keyof typeof statusIcons]
          
          return (
            <div
              key={order.id}
              className="border border-white/10 p-8 hover:border-white/20 transition-colors duration-300"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-light tracking-wide text-white mb-2">
                    Order #{order.orderNumber}
                  </h3>
                  <p className="text-gray-400">
                    Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-light text-white">
                    {formatPrice(order.finalPrice)}
                  </p>
                  {order.discountAmount > 0 && (
                    <p className="text-green-400 text-sm">
                      Saved {formatPrice(order.discountAmount)}
                    </p>
                  )}
                </div>
              </div>

              {/* Content Grid */}
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Order Details */}
                <div>
                  <h4 className="text-lg font-light text-white mb-4 tracking-wide">Order Details</h4>
                  <div className="space-y-3 text-gray-400">
                    <div className="flex justify-between">
                      <span>Style:</span>
                      <span className="text-white">{order.style}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Size:</span>
                      <span className="text-white">{order.size}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>People:</span>
                      <span className="text-white">{order.numberOfFaces}</span>
                    </div>
                    {order.offer && (
                      <div className="flex justify-between">
                        <span>Offer:</span>
                        <span className="text-green-400">{order.offer.title}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status */}
                <div>
                  <h4 className="text-lg font-light text-white mb-4 tracking-wide">Status</h4>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <StatusIcon className="w-5 h-5 text-white" />
                      <span className={`px-3 py-1 text-xs uppercase tracking-wider ${statusColors[order.status as keyof typeof statusColors]}`}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {statusDescriptions[order.status as keyof typeof statusDescriptions]}
                    </p>
                    <div>
                      <span className={`px-3 py-1 text-xs uppercase tracking-wider ${paymentStatusColors[order.paymentStatus as keyof typeof paymentStatusColors]}`}>
                        Payment: {order.paymentStatus}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview Alert */}
              {order.previewUrl && (
                <div className="mb-8 p-6 border border-blue-500/30 bg-blue-500/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-400 font-medium mb-2">
                        🎨 Your sketch preview is ready!
                      </p>
                      <p className="text-gray-400 text-sm">
                        Review your portrait and let us know if you'd like any changes.
                      </p>
                    </div>
                    <a
                      href={order.previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-2 bg-blue-600 text-white text-sm uppercase tracking-wider hover:bg-blue-700 transition-colors"
                    >
                      View Preview
                    </a>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-between items-center">
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="flex items-center space-x-2 px-6 py-2 border border-white/30 text-sm uppercase tracking-wider hover:bg-white hover:text-black transition-colors duration-300"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Details</span>
                </button>

                {order.status === 'PREVIEW_SENT' && (
                  <div className="text-sm text-gray-400">
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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-black border border-white/20 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-8 pb-6 border-b border-white/10">
                <h3 className="text-3xl font-light tracking-wider text-white">
                  Order #{selectedOrder.orderNumber}
                </h3>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 hover:bg-white/10 transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Order Information */}
                <div>
                  <h4 className="text-xl font-light tracking-wide text-white mb-6">Order Information</h4>
                  <div className="space-y-4 text-gray-400">
                    <div className="flex justify-between">
                      <span>Style:</span>
                      <span className="text-white">{selectedOrder.style}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Size:</span>
                      <span className="text-white">{selectedOrder.size}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Number of People:</span>
                      <span className="text-white">{selectedOrder.numberOfFaces}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Order Date:</span>
                      <span className="text-white">
                        {new Date(selectedOrder.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    {selectedOrder.offer && (
                      <div className="flex justify-between">
                        <span>Offer Applied:</span>
                        <span className="text-green-400">{selectedOrder.offer.title}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Pricing Breakdown */}
                <div>
                  <h4 className="text-xl font-light tracking-wide text-white mb-6">Pricing Breakdown</h4>
                  <div className="space-y-4 text-gray-400">
                    <div className="flex justify-between">
                      <span>Base Price:</span>
                      <span className="text-white">{formatPrice(selectedOrder.basePrice)}</span>
                    </div>
                    {selectedOrder.discountAmount > 0 && (
                      <div className="flex justify-between">
                        <span>Discount:</span>
                        <span className="text-green-400">-{formatPrice(selectedOrder.discountAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-xl font-light border-t border-white/10 pt-4">
                      <span className="text-white">Total:</span>
                      <span className="text-white">{formatPrice(selectedOrder.finalPrice)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Special Notes */}
              {selectedOrder.specialNotes && (
                <div className="mb-8">
                  <h4 className="text-xl font-light tracking-wide text-white mb-4">Your Notes</h4>
                  <div className="p-6 border border-white/10 bg-white/5">
                    <p className="text-gray-400 leading-relaxed">
                      {selectedOrder.specialNotes}
                    </p>
                  </div>
                </div>
              )}

              {/* Uploaded Photos */}
              {selectedOrder.images.length > 0 && (
                <div className="mb-8">
                  <h4 className="text-xl font-light tracking-wide text-white mb-6">Your Photos</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {selectedOrder.images.map((image) => (
                      <div key={image.id} className="aspect-square border border-white/10 overflow-hidden">
                        <img
                          src={image.imageUrl}
                          alt="Your uploaded photo"
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Preview Section */}
              {selectedOrder.previewUrl && (
                <div className="border border-blue-500/30 bg-blue-500/10 p-6">
                  <h4 className="text-xl font-light tracking-wide text-blue-400 mb-4">
                    Preview Available
                  </h4>
                  <p className="text-gray-400 mb-6 leading-relaxed">
                    Your sketch portrait preview is ready for review! Please check it carefully and let us know if you'd like any adjustments.
                  </p>
                  <a
                    href={selectedOrder.previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-8 py-3 bg-blue-600 text-white text-sm uppercase tracking-widest hover:bg-blue-700 transition-colors duration-300"
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