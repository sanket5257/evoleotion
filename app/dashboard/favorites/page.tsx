import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
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

    // For now, we'll get gallery images as potential favorites
    // In a real app, you'd have a favorites table
    const galleryImages = await prisma.galleryImage.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      take: 20
    })

    return { galleryImages, userId: session.userId }
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