import { prisma } from '@/lib/prisma'
import { GalleryGrid } from '@/components/gallery/gallery-grid'
import { GalleryFilters } from '@/components/gallery/gallery-filters'
import { PageTransition } from '@/components/animations/page-transition'
import { TextReveal } from '@/components/animations/text-reveal'

async function getGalleryData() {
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

          <GalleryFilters styles={styles} />
          <GalleryGrid images={images} />
        </div>
      </div>
    </PageTransition>
  )
}