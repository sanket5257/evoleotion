import { prisma } from '@/lib/prisma'
import { GalleryGrid } from '@/components/gallery/gallery-grid'
import { GalleryFilters } from '@/components/gallery/gallery-filters'
import { PageTransition } from '@/components/animations/page-transition'
import { Navbar } from '@/components/layout/navbar'

// Force dynamic rendering - prevents static generation at build time
export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getGalleryData() {
  try {
    const [images, styles] = await Promise.all([
      prisma.galleryImage.findMany({
        where: { isActive: true },
        orderBy: { order: 'asc' }
      }),
      prisma.galleryImage.findMany({
        where: { isActive: true },
        select: { style: true },
        distinct: ['style']
      })
    ])

    return {
      images: images.map(image => ({
        ...image,
        createdAt: image.createdAt.toISOString(),
        updatedAt: image.updatedAt.toISOString(),
      })),
      styles: styles.map(s => s.style)
    }
  } catch (error) {
    console.error('Error fetching gallery data:', error)
    return {
      images: [],
      styles: []
    }
  }
}

export default async function GalleryPage() {
  const { images, styles } = await getGalleryData()

  return (
    <PageTransition>
      <div className="min-h-screen bg-black text-white">
        {/* Navigation */}
        <Navbar />

        <div className="px-8 py-16">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-6xl md:text-8xl font-light tracking-wider mb-8">
                Gallery
              </h1>
                <div className="text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed">
                Explore our collection of stunning pencil and charcoal portraits. 
                Each piece showcases the artistry and craftsmanship we bring to every commission.
              </div>
            </div>

            {images.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-gray-400 mb-4">
                  <div className="text-6xl">🖼️</div>
                </div>
                <h3 className="text-xl font-light text-white mb-2">
                  Gallery Coming Soon
                </h3>
                <p className="text-gray-400 mb-4">
                  Our portfolio is being updated with new artwork. Please check back soon!
                </p>
              </div>
            ) : (
              <>
                <GalleryFilters styles={styles} />
                <GalleryGrid images={images} />
              </>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  )
}