'use client'

import { useSession, signOut } from 'next-auth/react'
import { Bell, LogOut, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/layout/theme-toggle'

export function AdminHeader() {
  const { data: session } = useSession()

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Manage your portrait studio
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <ThemeToggle />
          
          <Button variant="ghost" size="sm">
            <Bell className="w-5 h-5" />
          </Button>

          <div className="flex items-center space-x-3 pl-4 border-l border-gray-200 dark:border-gray-700">
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {session?.user?.name || session?.user?.email}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Administrator
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut()}
              className="flex items-center space-x-1"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}