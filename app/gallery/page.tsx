import { supabaseServer } from '@/lib/supabase-server'
import { GalleryGrid } from '@/components/gallery/gallery-grid'
import { GalleryFilters } from '@/components/gallery/gallery-filters'
import { Navbar } from '@/components/layout/navbar'

// Force dynamic rendering - prevents static generation at build time
export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getGalleryData() {
  try {
    // Get active gallery images
    const { data: images, error: imagesError } = await supabaseServer
      .from('gallery_images')
      .select('*')
      .eq('isActive', true)
      .order('order', { ascending: true })

    if (imagesError) {
      console.error('Error fetching gallery images:', imagesError)
    }

    // Get distinct styles
    const { data: stylesData, error: stylesError } = await supabaseServer
      .from('gallery_images')
      .select('style')
      .eq('isActive', true)

    if (stylesError) {
      console.error('Error fetching gallery styles:', stylesError)
    }

    // Extract unique styles
    const uniqueStyles = [...new Set((stylesData || []).map(item => item.style))]

    return {
      images: (images || []).map(image => ({
        ...image,
        createdAt: image.createdAt || new Date().toISOString(),
        updatedAt: image.updatedAt || new Date().toISOString(),
      })),
      styles: uniqueStyles
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
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <Navbar />

      <div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light tracking-wider mb-4 sm:mb-6 lg:mb-8">
              Gallery
            </h1>
              <div className="text-base sm:text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed px-4">
              Explore our collection of stunning pencil and charcoal portraits. 
              Each piece showcases the artistry and craftsmanship we bring to every commission.
            </div>
          </div>

          {images.length === 0 ? (
            <div className="text-center py-8 sm:py-12 lg:py-16">
              <div className="text-gray-400 mb-4">
                <div className="text-4xl sm:text-5xl lg:text-6xl">🖼️</div>
              </div>
              <h3 className="text-lg sm:text-xl font-light text-white mb-2">
                Gallery Coming Soon
              </h3>
              <p className="text-sm sm:text-base text-gray-400 mb-4 px-4">
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
  )
}