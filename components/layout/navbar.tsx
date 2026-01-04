'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface User {
  userId: string
  email: string
  name?: string
  role: string
}

export function Navbar() {
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check session on component mount
    fetch('/api/auth/session')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true
    if (path !== '/' && pathname.startsWith(path)) return true
    return false
  }

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/signout', { method: 'POST' })
      setUser(null)
      window.location.href = '/'
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  return (
    <nav className="flex justify-between items-center p-8 relative z-50">
      <div className="text-2xl font-bold tracking-wider">
        <Link href="/" className="hover:text-gray-300 transition-colors">
          Evoleotion
        </Link>
      </div>
      
      <div className="flex items-center space-x-8">
        {/* Main Navigation */}
        <div className="flex space-x-8 text-sm uppercase tracking-widest">
          <Link 
            href="/" 
            className={`hover:text-gray-300 transition-colors ${
              isActive('/') ? 'text-gray-300' : ''
            }`}
          >
            Portraits
          </Link>
          <Link 
            href="/gallery" 
            className={`hover:text-gray-300 transition-colors ${
              isActive('/gallery') ? 'text-gray-300' : ''
            }`}
          >
            Gallery
          </Link>
          <Link 
            href="/#how-it-works" 
            className="hover:text-gray-300 transition-colors"
          >
            How It Works
          </Link>
          <Link 
            href="/about" 
            className={`hover:text-gray-300 transition-colors ${
              isActive('/about') ? 'text-gray-300' : ''
            }`}
          >
            About
          </Link>
          <Link 
            href="/contact" 
            className={`hover:text-gray-300 transition-colors ${
              isActive('/contact') ? 'text-gray-300' : ''
            }`}
          >
            Commission
          </Link>
          <Link 
            href="/order" 
            className={`px-4 py-2 border border-white/30 hover:bg-white hover:text-black transition-colors duration-300 ${
              isActive('/order') ? 'bg-white text-black' : ''
            }`}
            title={user ? 'Order Now' : 'Sign up to order'}
          >
            Order Now
          </Link>
        </div>

        {/* Auth Section */}
        <div className="flex items-center space-x-4 ml-8 pl-8 border-l border-white/20">
          {loading ? (
            <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
          ) : user ? (
            <div className="flex items-center space-x-4">
              {user.role === 'ADMIN' && (
                <Link 
                  href="/admin" 
                  className="text-sm uppercase tracking-widest hover:text-gray-300 transition-colors"
                >
                  Admin
                </Link>
              )}
              <Link 
                href="/dashboard" 
                className="text-sm uppercase tracking-widest hover:text-gray-300 transition-colors"
              >
                Dashboard
              </Link>
              <button
                onClick={handleSignOut}
                className="text-sm uppercase tracking-widest hover:text-gray-300 transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link 
                href="/auth/signin" 
                className="text-sm uppercase tracking-widest hover:text-gray-300 transition-colors"
              >
                Sign In
              </Link>
              <Link 
                href="/auth/signup" 
                className="px-4 py-2 border border-white/30 text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-colors duration-300"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}