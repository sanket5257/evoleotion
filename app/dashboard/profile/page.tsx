import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { ProfileManager } from '@/components/dashboard/profile-manager'
import { PageTransition } from '@/components/animations/page-transition'
import { Navbar } from '@/components/layout/navbar'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getUserProfile() {
  try {
    const session = await getSession()
    
    if (!session?.userId) {
      redirect('/auth/signin')
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            orders: true
          }
        }
      }
    })

    if (!user) {
      redirect('/auth/signin')
    }

    return user
  } catch (error) {
    console.error('Error fetching user profile:', error)
    redirect('/auth/signin')
  }
}

export default async function ProfilePage() {
  const user = await getUserProfile()

  return (
    <PageTransition>
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        
        <div className="px-8 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="mb-12">
              <h1 className="text-4xl md:text-6xl font-light tracking-wider mb-4">
                My Profile
              </h1>
              <p className="text-lg text-gray-400">
                Manage your account information and preferences
              </p>
            </div>

            <ProfileManager user={user} />
          </div>
        </div>
      </div>
    </PageTransition>
  )
}