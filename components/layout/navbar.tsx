'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Menu, X, User, LogOut, Settings, ShoppingCart } from 'lucide-react'

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [mobileMenuOpen])

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true
    if (path !== '/' && pathname.startsWith(path)) return true
    return false
  }

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/signout', { method: 'POST' })
      setUser(null)
      setMobileMenuOpen(false)
      window.location.href = '/'
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  const navigationLinks = [
    { href: '/', label: 'Portraits' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/#how-it-works', label: 'How It Works' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Commission' },
  ]

  return (
    <>
      <nav className="flex justify-between items-center p-4 md:p-8 relative z-50">
        {/* Logo */}
        <div className="text-xl md:text-2xl font-bold tracking-wider">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            Evoleotion
          </Link>
        </div>
        
        {/* Mobile Cart & Menu */}
        <div className="flex items-center space-x-4 lg:hidden">
          {/* Mobile Cart Icon - Always visible when user is logged in */}
          {!loading && user && (
            <Link
              href="/dashboard"
              className="p-2 hover:bg-white/10 transition-colors"
              title="My Orders"
            >
              <ShoppingCart className="w-6 h-6" />
            </Link>
          )}
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 hover:bg-white/10 transition-colors"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-8">
          {/* Main Navigation */}
          <div className="flex space-x-8 text-sm uppercase tracking-widest">
            {navigationLinks.map((link) => (
              <Link 
                key={link.href}
                href={link.href} 
                className={`hover:text-gray-300 transition-colors ${
                  isActive(link.href) ? 'text-gray-300' : ''
                }`}
              >
                {link.label}
              </Link>
            ))}
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
                  title="My Orders"
                >
                  <ShoppingCart className="w-5 h-5" />
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

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-40 lg:hidden">
          <div className="flex flex-col h-full pt-20 px-8">
            {/* Navigation Links */}
            <div className="flex-1 space-y-8">
              {navigationLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block text-2xl font-light tracking-wider hover:text-gray-300 transition-colors ${
                    isActive(link.href) ? 'text-gray-300' : 'text-white'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              
              {/* Order Button */}
              <Link
                href="/order"
                className={`block w-full text-center py-4 border border-white/30 text-lg uppercase tracking-widest hover:bg-white hover:text-black transition-colors duration-300 ${
                  isActive('/order') ? 'bg-white text-black' : 'text-white'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Order Now
              </Link>
            </div>

            {/* Auth Section */}
            <div className="border-t border-white/20 pt-8 pb-8">
              {loading ? (
                <div className="flex justify-center">
                  <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                </div>
              ) : user ? (
                <div className="space-y-6">
                  {/* User Info */}
                  <div className="flex items-center space-x-3 pb-4 border-b border-white/10">
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{user.name || 'User'}</p>
                      <p className="text-gray-400 text-sm">{user.email}</p>
                    </div>
                  </div>

                  {/* User Actions */}
                  <div className="space-y-4">
                    {user.role === 'ADMIN' && (
                      <Link
                        href="/admin"
                        className="flex items-center space-x-3 text-white hover:text-gray-300 transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Settings className="w-5 h-5" />
                        <span className="text-lg">Admin Panel</span>
                      </Link>
                    )}

                    <button
                      onClick={handleSignOut}
                      className="flex items-center space-x-3 text-white hover:text-gray-300 transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="text-lg">Sign Out</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <Link
                    href="/auth/signin"
                    className="block w-full text-center py-3 text-lg uppercase tracking-widest text-white hover:text-gray-300 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="block w-full text-center py-3 border border-white/30 text-lg uppercase tracking-widest hover:bg-white hover:text-black transition-colors duration-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}