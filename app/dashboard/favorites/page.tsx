import { getSession } from '@/lib/session'
import { supabaseServer } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { FavoritesManager } from '@/components/dashboard/favorites-manager'
import { PageTransition } from '@/components/animations/page-transition'
import { Navbar } from '@/components/layout/navbar'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getUserFavorites() {
  try {
    const session = await getSession()
    
    if (!session?.userId) {
      redirect('/auth/signin')
    }

    // Get all gallery images for the favorites manager to work with
    const { data: galleryImages, error } = await supabaseServer
      .from('gallery_images')
      .select(`
        id,
        title,
        description,
        imageUrl,
        style,
        tags,
        createdAt,
        updatedAt
      `)
      .eq('isActive', true)
      .order('orderIndex', { ascending: true })

    if (error) {
      console.error('Error fetching gallery images:', error)
      return { galleryImages: [], userId: session.userId }
    }

    // Return images with consistent date format
    const serializedImages = (galleryImages || []).map(image => ({
      ...image,
      createdAt: image.createdAt || new Date().toISOString(),
      updatedAt: image.updatedAt || new Date().toISOString(),
    }))

    return { galleryImages: serializedImages, userId: session.userId }
  } catch (error) {
    console.error('Error fetching favorites:', error)
    return { galleryImages: [], userId: null }
  }
}

export default async function FavoritesPage() {
  const { galleryImages, userId } = await getUserFavorites()

  if (!userId) {
    redirect('/auth/signin')
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        
        <div className="px-8 py-16">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12">
              <h1 className="text-4xl md:text-6xl font-light tracking-wider mb-4">
                My Favorites
              </h1>
              <p className="text-lg text-gray-400">
                Your saved artwork and inspiration gallery
              </p>
            </div>

            <FavoritesManager galleryImages={galleryImages} />
          </div>
        </div>
      </div>
    </PageTransition>
  )
}