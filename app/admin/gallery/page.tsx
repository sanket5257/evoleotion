import { prisma } from '@/lib/prisma'
import { GalleryManager } from '@/components/admin/gallery-manager'

async function getGalleryImages() {
  const images = await prisma.galleryImage.findMany({
    orderBy: { order: 'asc' }
  })
  
  // Serialize dates to avoid hydration issues
  return images.map(image => ({
    ...image,
    createdAt: image.createdAt.toISOString(),
    updatedAt: image.updatedAt.toISOString(),
  }))
}

// Revalidate this page every time it's accessed
export const revalidate = 0

export default async function AdminGalleryPage() {
  const images = await getGalleryImages()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Gallery Management</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your portfolio images and showcase your best work
        </p>
      </div>

      <GalleryManager images={images} />
    </div>
  )
}