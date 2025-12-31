import { prisma } from '@/lib/prisma'
import { GalleryGrid } from '@/components/gallery/gallery-grid'
import { GalleryFilters } from '@/components/gallery/gallery-filters'
import { PageTransition } from '@/components/animations/page-transition'
import { TextReveal } from '@/components/animations/text-reveal'

// Force dynamic rendering - prevents static generation at build time
export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getGalleryData() {
  try {
    console.log('Fetching gallery data...')
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

    console.log(`Found ${images.length} images and ${styles.length} styles`)

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
      <div className="py-24">
        <div className="container-width section-padding">
          <div className="text-center mb-16">
            <TextReveal className="text-4xl lg:text-6xl font-bold mb-6">
              Our
              <span className="gradient-text block">Gallery</span>
            </TextReveal>
            <TextReveal 
              className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
              delay={0.2}
            >
              Explore our collection of stunning portraits created by our talented artists. 
              Each piece showcases the unique style and craftsmanship we bring to every commission.
            </TextReveal>
          </div>

          {images.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-gray-400 mb-4">
                <div className="text-6xl">🖼️</div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No gallery images available
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Our gallery is being updated. Please check back soon!
              </p>
              {process.env.NODE_ENV === 'development' && (
                <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg max-w-md mx-auto">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Debug: No images found in database. Run seed script to populate data.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <>
              <GalleryFilters styles={styles} />
              <GalleryGrid images={images} />
            </>
          )}
        </div>
      </div>
    </PageTransition>
  )
}