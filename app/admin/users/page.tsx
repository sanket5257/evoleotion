import { supabaseServer } from '@/lib/supabase-server'
import { UsersManager } from '@/components/admin/users-manager'

// Force dynamic rendering - prevents static generation at build time
export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getUsers() {
  try {
    // Check if database connection is available
    if (!supabaseServer) {
      console.error('Database connection not available')
      return []
    }

    const { data: users, error } = await supabaseServer
      .from('users')
      .select(`
        *
      `)
      .order('createdAt', { ascending: false })
    
    if (error) {
      console.error('Error fetching users:', error)
      return []
    }
    
    return users || []
  } catch (error) {
    console.error('Error fetching users:', error)
    return []
  }
}

async function getUserStats() {
  try {
    if (!supabaseServer) {
      return { totalUsers: 0, adminUsers: 0, regularUsers: 0 }
    }

    // Get total user count
    const { count: totalUsers } = await supabaseServer
      .from('users')
      .select('*', { count: 'exact', head: true })

    // Get admin user count
    const { count: adminUsers } = await supabaseServer
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'ADMIN')

    // Get regular user count
    const { count: regularUsers } = await supabaseServer
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'USER')

    return {
      totalUsers: totalUsers || 0,
      adminUsers: adminUsers || 0,
      regularUsers: regularUsers || 0
    }
  } catch (error) {
    console.error('Error fetching user stats:', error)
    return { totalUsers: 0, adminUsers: 0, regularUsers: 0 }
  }
}

export default async function AdminUsersPage() {
  const users = await getUsers()
  const stats = await getUserStats()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">User Management</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Manage user accounts and permissions
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Admin Users</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.adminUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Regular Users</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.regularUsers}</p>
            </div>
          </div>
        </div>
      </div>

      <UsersManager users={users} />
    </div>
  )
}