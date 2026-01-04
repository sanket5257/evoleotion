import { prisma } from '@/lib/prisma'
import { GalleryManager } from '@/components/admin/gallery-manager'

// Force dynamic rendering - prevents static generation at build time
export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getGalleryImages() {
  try {
    const images = await prisma.galleryImage.findMany({
      orderBy: { order: 'asc' }
    })
    
    // Serialize dates to avoid hydration issues
    return images.map(image => ({
      ...image,
      createdAt: image.createdAt.toISOString(),
      updatedAt: image.updatedAt.toISOString(),
    }))
  } catch (error) {
    console.error('Error fetching gallery images:', error)
    return []
  }
}

export default async function AdminGalleryPage() {
  const images = await getGalleryImages()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Gallery Management</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your sketch portfolio images and showcase your best work
        </p>
      </div>

      <GalleryManager images={images} />
    </div>
  )
}