'use client'

import { useState } from 'react'
import { Eye, Edit, MessageCircle, Upload, Download, DownloadCloud } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
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
  adminNotes?: string | null
  previewUrl?: string | null
  createdAt: Date
  user?: { name: string | null; email: string } | null
  offer?: { title: string } | null
  images: { id: string; imageUrl: string }[]
}

interface OrdersManagerProps {
  orders: Order[]
}

const STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'PREVIEW_SENT', label: 'Preview Sent' },
  { value: 'REVISION', label: 'Revision' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'COMPLETED', label: 'Completed' },
]

const PAYMENT_STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'PAID', label: 'Paid' },
  { value: 'REFUNDED', label: 'Refunded' },
]

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

export function OrdersManager({ orders }: OrdersManagerProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [statusFilter, setStatusFilter] = useState('')
  const [paymentFilter, setPaymentFilter] = useState('')
  const [adminNotes, setAdminNotes] = useState('')

  // Filter orders
  const filteredOrders = orders.filter(order => {
    if (statusFilter && order.status !== statusFilter) return false
    if (paymentFilter && order.paymentStatus !== paymentFilter) return false
    return true
  })

  const handleStatusUpdate = async (orderId: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      
      if (!response.ok) throw new Error('Failed to update order status')
      
      // Refresh the page to show updated data
      window.location.reload()
    } catch (error) {
      console.error('Error updating order status:', error)
      alert('Failed to update order status. Please try again.')
    }
  }

  const handlePaymentUpdate = async (orderId: string, paymentStatus: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/payment`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentStatus })
      })
      
      if (!response.ok) throw new Error('Failed to update payment status')
      
      // Refresh the page to show updated data
      window.location.reload()
    } catch (error) {
      console.error('Error updating payment status:', error)
      alert('Failed to update payment status. Please try again.')
    }
  }

  const openWhatsApp = (order: Order) => {
    const message = `Hi ${order.customerName}! Regarding your order ${order.orderNumber}...`
    const url = `https://wa.me/${order.customerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  const handleNotesUpdate = async (orderId: string, notes: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/notes`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminNotes: notes })
      })
      
      if (!response.ok) throw new Error('Failed to update notes')
      
      // Update the selected order with new notes
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, adminNotes: notes })
      }
    } catch (error) {
      console.error('Error updating notes:', error)
      alert('Failed to update notes. Please try again.')
    }
  }

  const getImageInfo = (imageUrl: string) => {
    // Extract filename from URL
    const urlParts = imageUrl.split('/')
    const filename = urlParts[urlParts.length - 1]
    
    // Try to determine file type from URL
    const extension = filename.split('.').pop()?.toLowerCase()
    const fileType = extension ? extension.toUpperCase() : 'Unknown'
    
    return { filename, fileType }
  }

  const downloadImage = async (imageUrl: string, filename?: string) => {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      
      // Generate filename if not provided
      const finalFilename = filename || `order-${selectedOrder?.orderNumber}-image-${Date.now()}.jpg`
      link.download = finalFilename
      
      // Trigger download
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // Clean up
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading image:', error)
      alert('Failed to download image. Please try again.')
    }
  }

  const downloadAllImages = async (order: Order) => {
    if (order.images.length === 0) {
      alert('No images to download for this order.')
      return
    }

    try {
      // Download each image with a numbered filename
      for (let i = 0; i < order.images.length; i++) {
        const image = order.images[i]
        const filename = `${order.orderNumber}-image-${i + 1}.jpg`
        
        // Add a small delay between downloads to avoid overwhelming the browser
        if (i > 0) {
          await new Promise(resolve => setTimeout(resolve, 500))
        }
        
        await downloadImage(image.imageUrl, filename)
      }
    } catch (error) {
      console.error('Error downloading all images:', error)
      alert('Failed to download some images. Please try again.')
    }
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={[
            { value: '', label: 'All Statuses' },
            ...STATUS_OPTIONS
          ]}
        />
        
        <Select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
          options={[
            { value: '', label: 'All Payment Status' },
            ...PAYMENT_STATUS_OPTIONS
          ]}
        />

        <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
          Showing {filteredOrders.length} of {orders.length} orders
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {order.orderNumber}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {order.customerName}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {order.customerEmail}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {order.style} • {order.size}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-2">
                      <span>{order.numberOfFaces} {order.numberOfFaces === 1 ? 'person' : 'people'}</span>
                      {order.images.length > 0 && (
                        <span className="flex items-center space-x-1 text-blue-600 dark:text-blue-400">
                          <Upload className="w-3 h-3" />
                          <span>{order.images.length} image{order.images.length !== 1 ? 's' : ''}</span>
                        </span>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatPrice(order.finalPrice)}
                    </div>
                    {order.discountAmount > 0 && (
                      <div className="text-sm text-green-600 dark:text-green-400">
                        -{formatPrice(order.discountAmount)} discount
                      </div>
                    )}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className={statusColors[order.status as keyof typeof statusColors]}>
                      {order.status.replace('_', ' ')}
                    </Badge>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className={paymentStatusColors[order.paymentStatus as keyof typeof paymentStatusColors]}>
                      {order.paymentStatus}
                    </Badge>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSelectedOrder(order)
                          setAdminNotes(order.adminNotes || '')
                        }}
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      
                      {order.images.length > 0 && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => downloadAllImages(order)}
                          className="text-blue-600 hover:text-blue-700"
                          title={`Download ${order.images.length} image${order.images.length !== 1 ? 's' : ''}`}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      )}
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openWhatsApp(order)}
                        className="text-green-600 hover:text-green-700"
                        title="Contact via WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Eye className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No orders found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {statusFilter || paymentFilter ? 'Try adjusting your filters' : 'Orders will appear here once customers start placing them'}
          </p>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Order Details - {selectedOrder.orderNumber}
                </h3>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedOrder(null)}
                >
                  ✕
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Customer Info */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold">Customer Information</h4>
                  <div className="space-y-2">
                    <p><strong>Name:</strong> {selectedOrder.customerName}</p>
                    <p><strong>Email:</strong> {selectedOrder.customerEmail}</p>
                    <p><strong>Phone:</strong> {selectedOrder.customerPhone}</p>
                  </div>
                </div>

                {/* Order Info */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold">Order Information</h4>
                  <div className="space-y-2">
                    <p><strong>Style:</strong> {selectedOrder.style}</p>
                    <p><strong>Size:</strong> {selectedOrder.size}</p>
                    <p><strong>Faces:</strong> {selectedOrder.numberOfFaces}</p>
                  </div>
                </div>
              </div>

              {/* Status Updates */}
              <div className="mt-6 grid md:grid-cols-2 gap-4">
                <Select
                  label="Order Status"
                  value={selectedOrder.status}
                  onChange={(e) => handleStatusUpdate(selectedOrder.id, e.target.value)}
                  options={STATUS_OPTIONS}
                />
                
                <Select
                  label="Payment Status"
                  value={selectedOrder.paymentStatus}
                  onChange={(e) => handlePaymentUpdate(selectedOrder.id, e.target.value)}
                  options={PAYMENT_STATUS_OPTIONS}
                />
              </div>

              {/* Images */}
              {selectedOrder.images.length > 0 && (
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-semibold">Customer Images ({selectedOrder.images.length})</h4>
                    <Button
                      onClick={() => downloadAllImages(selectedOrder)}
                      className="flex items-center space-x-2"
                      size="sm"
                    >
                      <DownloadCloud className="w-4 h-4" />
                      <span>Download All</span>
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {selectedOrder.images.map((image, index) => {
                      const { filename, fileType } = getImageInfo(image.imageUrl)
                      return (
                        <div key={image.id} className="relative group">
                          <img
                            src={image.imageUrl}
                            alt={`Customer upload ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                          />
                          
                          {/* Download overlay */}
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                            <Button
                              onClick={() => downloadImage(image.imageUrl, `${selectedOrder.orderNumber}-image-${index + 1}.jpg`)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                              size="sm"
                              variant="outline"
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                          
                          {/* Image number badge */}
                          <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                            {index + 1}
                          </div>
                          
                          {/* File type badge */}
                          <div className="absolute top-2 right-2 bg-blue-600 bg-opacity-80 text-white text-xs px-1 py-0.5 rounded">
                            {fileType}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  
                  {/* Image info */}
                  <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                    <p>💡 Tip: Hover over images to download individually, or use "Download All" to get all images at once.</p>
                  </div>
                </div>
              )}

              {/* Notes */}
              <div className="mt-6 space-y-4">
                {selectedOrder.specialNotes && (
                  <div>
                    <h4 className="text-lg font-semibold mb-2">Customer Notes</h4>
                    <p className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-3 rounded">
                      {selectedOrder.specialNotes}
                    </p>
                  </div>
                )}
                
                <Textarea
                  label="Admin Notes"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add internal notes about this order..."
                  rows={3}
                />
                <Button
                  onClick={() => handleNotesUpdate(selectedOrder.id, adminNotes)}
                  className="mt-2"
                >
                  Save Notes
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}