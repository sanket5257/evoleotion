'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { Menu, X, User, LogOut, Settings, ShoppingCart } from 'lucide-react'
import { useAuth } from '@/components/auth/auth-context'

export function Navbar() {
  const pathname = usePathname()
  const { user, loading, signOut } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  // Prevent body scroll when mobile menu is open (client-side only)
  useEffect(() => {
    if (!mounted) return
    
    if (typeof document !== 'undefined') {
      if (mobileMenuOpen) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = 'unset'
      }
    }
    
    return () => {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = 'unset'
      }
    }
  }, [mobileMenuOpen, mounted])

  const isActive = useCallback((path: string) => {
    if (!pathname) return false
    if (path === '/' && pathname === '/') return true
    if (path !== '/' && pathname.startsWith(path)) return true
    return false
  }, [pathname])

  const handleSignOut = useCallback(async () => {
    try {
      await signOut()
      setMobileMenuOpen(false)
      
      // Safe navigation
      if (typeof window !== 'undefined') {
        window.location.href = '/'
      }
    } catch (error) {
      console.error('Sign out error:', error)
      setMobileMenuOpen(false)
    }
  }, [signOut])

  const navigationLinks = [
    { href: '/', label: 'Portraits' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/#how-it-works', label: 'How It Works' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Commission' },
  ]

  // Don't render interactive elements until mounted
  if (!mounted) {
    return (
      <nav className="flex justify-between items-center p-4 md:p-8 relative z-50">
        <div className="text-xl md:text-2xl font-bold tracking-wider">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            Evoleotion
          </Link>
        </div>
        <div className="hidden lg:flex items-center space-x-8">
          <div className="flex space-x-8 text-sm uppercase tracking-widest">
            {navigationLinks.map((link) => (
              <Link 
                key={link.href}
                href={link.href} 
                className="hover:text-gray-300 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    )
  }

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
        <div className="flex items-center space-x-2 lg:hidden">
          {/* Mobile Cart Icon - Only visible when user is logged in */}
          {!loading && user && (
            <Link
              href="/dashboard"
              className="p-2 hover:bg-white/10 transition-colors rounded-lg"
              title="My Orders"
            >
              <ShoppingCart className="w-6 h-6" />
            </Link>
          )}

          {/* Mobile Sign In Indicator - Only visible when user is NOT logged in */}
          {!loading && !user && (
            <Link
              href="/auth/signin"
              className="px-3 py-1 text-xs uppercase tracking-widest border border-white/30 hover:bg-white hover:text-black transition-colors duration-300 rounded"
            >
              Sign In
            </Link>
          )}
          
          {/* Mobile Menu Button */}
          <div
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                setMobileMenuOpen(!mobileMenuOpen)
              }
            }}
            onMouseDown={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 hover:bg-white/10 transition-colors rounded-lg relative cursor-pointer ${
              !loading && !user ? 'ring-1 ring-white/20' : ''
            }`}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
            {/* Notification dot for unauthenticated users */}
            {!loading && !user && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-pulse" />
            )}
          </div>
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
                <div
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      handleSignOut()
                    }
                  }}
                  onMouseDown={handleSignOut}
                  className="text-sm uppercase tracking-widest hover:text-gray-300 transition-colors cursor-pointer"
                >
                  Sign Out
                </div>
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
          <div className="flex flex-col h-full pt-20 px-8 pb-8">
            {/* Navigation Links */}
            <div className="flex-1 space-y-6 overflow-y-auto">
              {navigationLinks.map((link) => (
                <div key={link.href} className="block">
                  <Link
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block w-full text-left text-xl font-light tracking-wider hover:text-gray-300 transition-colors ${
                      isActive(link.href) ? 'text-gray-300' : 'text-white'
                    }`}
                  >
                    {link.label}
                  </Link>
                </div>
              ))}
              
              {/* Order Button */}
              <div className="block">
                <Link
                  href="/order"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block w-full text-center py-3 border border-white/30 text-base uppercase tracking-widest hover:bg-white hover:text-black transition-colors duration-300 rounded ${
                    isActive('/order') ? 'bg-white text-black' : 'text-white'
                  }`}
                >
                  Order Now
                </Link>
              </div>
            </div>

            {/* Auth Section - Always visible at bottom */}
            <div className="border-t border-white/20 pt-6 mt-6 flex-shrink-0">
              {/* Debug info - remove this after testing */}
              <div className="mb-4 p-2 bg-gray-800 rounded text-xs">
                <p>Debug: Loading: {loading ? 'true' : 'false'}</p>
                <p>Debug: User: {user ? `${user.name || 'No name'} (${user.email})` : 'null'}</p>
                <p>Debug: Role: {user?.role || 'none'}</p>
              </div>
              
              {loading ? (
                <div className="flex justify-center py-4">
                  <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                </div>
              ) : user ? (
                <div className="space-y-4">
                  {/* User Info */}
                  <div className="flex items-center space-x-3 pb-4 border-b border-white/10">
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-white font-medium truncate">{user.name || 'User'}</p>
                      <p className="text-gray-400 text-sm truncate">{user.email}</p>
                    </div>
                  </div>

                  {/* User Actions */}
                  <div className="space-y-3">
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-3 text-white hover:text-gray-300 transition-colors py-2 w-full"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      <span className="text-base">My Orders</span>
                    </Link>

                    {user.role === 'ADMIN' && (
                      <Link
                        href="/admin"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center space-x-3 text-white hover:text-gray-300 transition-colors py-2 w-full"
                      >
                        <Settings className="w-5 h-5" />
                        <span className="text-base">Admin Panel</span>
                      </Link>
                    )}

                    <div
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          handleSignOut()
                        }
                      }}
                      onMouseDown={handleSignOut}
                      className="flex items-center space-x-3 text-white hover:text-gray-300 transition-colors py-2 w-full cursor-pointer"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="text-base">Sign Out</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="text-center mb-4">
                    <p className="text-gray-400 text-sm mb-3">Get started with your portrait order</p>
                  </div>
                  <Link
                    href="/auth/signin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center py-3 text-base uppercase tracking-widest text-white hover:text-gray-300 transition-colors border border-white/20 hover:border-white/40 rounded"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center py-3 border border-white/30 text-base uppercase tracking-widest bg-white text-black hover:bg-gray-200 transition-colors duration-300 rounded"
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