import { prisma } from '@/lib/prisma'
import { FramesManager } from '@/components/admin/frames-manager'

async function getFrames() {
  return await prisma.frame.findMany({
    orderBy: { order: 'asc' }
  })
}

export default async function AdminFramesPage() {
  const frames = await getFrames()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Frame Management</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Manage frame options and pricing for customer orders
        </p>
      </div>

      <FramesManager frames={frames} />
    </div>
  )
}