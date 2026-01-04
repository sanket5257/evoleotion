import { prisma } from '@/lib/prisma'
import { OrdersManager } from '@/components/admin/orders-manager'

// Force dynamic rendering - prevents static generation at build time
export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getOrders() {
  try {
    return await prisma.order.findMany({
      include: {
        user: { select: { name: true, email: true } },
        offer: { select: { title: true } },
        images: true,
      },
      orderBy: { createdAt: 'desc' }
    })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return []
  }
}

export default async function AdminOrdersPage() {
  const orders = await getOrders()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Order Management</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Track and manage all customer sketch orders
        </p>
      </div>

      <OrdersManager orders={orders} />
    </div>
  )
}