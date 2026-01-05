'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { Menu, X, User, LogOut, Settings, ShoppingCart, Search, Heart, Package, Phone, Info, Image, Palette, ChevronDown } from 'lucide-react'
import { useAuth } from '@/components/auth/auth-context'

export function Navbar() {
  const pathname = usePathname()
  const { user, loading, signOut } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Close menus when route changes
  useEffect(() => {
    setMobileMenuOpen(false)
    setUserMenuOpen(false)
  }, [pathname])

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.user-menu-container')) {
        setUserMenuOpen(false)
      }
    }

    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [userMenuOpen])

  // Prevent body scroll when mobile menu is open
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
      setUserMenuOpen(false)
      
      if (typeof window !== 'undefined') {
        window.location.href = '/'
      }
    } catch (error) {
      console.error('Sign out error:', error)
      setMobileMenuOpen(false)
      setUserMenuOpen(false)
    }
  }, [signOut])

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Navigate to gallery with search query
      window.location.href = `/gallery?search=${encodeURIComponent(searchQuery.trim())}`
    }
  }, [searchQuery])

  // Enhanced navigation structure for ecommerce
  const navigationLinks = [
    { 
      href: '/', 
      label: 'Home', 
      icon: <Palette className="w-4 h-4" />,
      description: 'Custom portraits & artwork'
    },
    { 
      href: '/gallery', 
      label: 'Gallery', 
      icon: <Image className="w-4 h-4" />,
      description: 'View our portfolio'
    },
    { 
      href: '/#how-it-works', 
      label: 'Process', 
      icon: <Info className="w-4 h-4" />,
      description: 'How we create your art'
    },
    { 
      href: '/about', 
      label: 'About', 
      icon: <User className="w-4 h-4" />,
      description: 'Our story & artists'
    },
    { 
      href: '/contact', 
      label: 'Contact', 
      icon: <Phone className="w-4 h-4" />,
      description: 'Get in touch'
    },
  ]

  // User account menu items
  const userMenuItems = [
    { href: '/dashboard', label: 'My Orders', icon: <ShoppingCart className="w-4 h-4" /> },
    { href: '/dashboard/profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
    { href: '/dashboard/favorites', label: 'Favorites', icon: <Heart className="w-4 h-4" /> },
  ]

  // Mock cart count - in real app, this would come from context/state
  const cartCount = user ? 0 : 0 // Replace with actual cart logic

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
          <div className="flex space-x-6 text-sm uppercase tracking-widest">
            {navigationLinks.slice(0, 3).map((link) => (
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
      <nav className="flex justify-between items-center p-4 md:p-6 lg:p-8 relative z-50 border-b border-white/10">
        {/* Logo */}
        <div className="text-xl md:text-2xl font-bold tracking-wider flex-shrink-0">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            Evoleotion
          </Link>
        </div>
        
        {/* Desktop Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <form onSubmit={handleSearch} className="w-full relative">
            <input
              type="text"
              placeholder="Search gallery..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white/40 transition-colors"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </form>
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center space-x-2 md:hidden">
          {/* Mobile Search */}
          <button
            onClick={() => {
              const query = prompt('Search gallery:')
              if (query) {
                window.location.href = `/gallery?search=${encodeURIComponent(query)}`
              }
            }}
            className="p-2 hover:bg-white/10 transition-colors rounded-lg"
            title="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Mobile Cart */}
          {!loading && user && (
            <Link
              href="/dashboard"
              className="p-2 hover:bg-white/10 transition-colors rounded-lg relative"
              title="My Orders"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          )}

          {/* Mobile Sign In */}
          {!loading && !user && (
            <Link
              href="/auth/signin"
              className="px-3 py-1.5 text-xs uppercase tracking-widest border border-white/30 hover:bg-white hover:text-black transition-colors duration-300 rounded"
            >
              Sign In
            </Link>
          )}
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 hover:bg-white/10 transition-colors rounded-lg"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {/* Main Navigation */}
          <div className="flex space-x-6 text-sm uppercase tracking-widest">
            {navigationLinks.slice(0, 3).map((link) => (
              <Link 
                key={link.href}
                href={link.href} 
                className={`hover:text-gray-300 transition-colors relative group ${
                  isActive(link.href) ? 'text-gray-300' : ''
                }`}
                title={link.description}
              >
                {link.label}
                {isActive(link.href) && (
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-white"></div>
                )}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <Link 
            href="/order" 
            className={`px-6 py-2.5 border border-white/30 hover:bg-white hover:text-black transition-colors duration-300 text-sm uppercase tracking-widest ${
              isActive('/order') ? 'bg-white text-black' : ''
            }`}
            title="Start your custom portrait order"
          >
            Order Now
          </Link>

          {/* Desktop Cart */}
          {!loading && user && (
            <Link 
              href="/dashboard" 
              className="p-2 hover:bg-white/10 transition-colors rounded-lg relative"
              title="My Orders"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          )}

          {/* User Menu */}
          <div className="relative user-menu-container">
            {loading ? (
              <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            ) : user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 p-2 hover:bg-white/10 transition-colors rounded-lg"
                  aria-label="User menu"
                >
                  <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* User Dropdown */}
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-black/95 backdrop-blur-sm border border-white/20 rounded-lg shadow-xl">
                    {/* User Info */}
                    <div className="p-4 border-b border-white/10">
                      <p className="text-white font-medium truncate">{user.name || 'User'}</p>
                      <p className="text-gray-400 text-sm truncate">{user.email}</p>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      {userMenuItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center space-x-3 px-4 py-2 text-white hover:bg-white/10 transition-colors"
                        >
                          {item.icon}
                          <span>{item.label}</span>
                        </Link>
                      ))}

                      {user.role === 'ADMIN' && (
                        <Link
                          href="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center space-x-3 px-4 py-2 text-white hover:bg-white/10 transition-colors"
                        >
                          <Settings className="w-4 h-4" />
                          <span>Admin Panel</span>
                        </Link>
                      )}

                      <hr className="border-white/10 my-2" />

                      <button
                        onClick={handleSignOut}
                        className="flex items-center space-x-3 px-4 py-2 text-white hover:bg-white/10 transition-colors w-full text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                href="/auth/signin" 
                className="px-4 py-2 border border-white/30 text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-colors duration-300"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Enhanced Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-40 md:hidden">
          <div className="flex flex-col h-full pt-20 px-6 pb-6">
            {/* Mobile Search */}
            <div className="mb-6">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search gallery..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pl-10 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white/40"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </form>
            </div>

            {/* Navigation Links */}
            <div className="flex-1 space-y-1 overflow-y-auto">
              {navigationLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 p-4 rounded-lg hover:bg-white/10 transition-colors ${
                    isActive(link.href) ? 'bg-white/10 text-gray-300' : 'text-white'
                  }`}
                >
                  {link.icon}
                  <div>
                    <div className="font-medium">{link.label}</div>
                    <div className="text-sm text-gray-400">{link.description}</div>
                  </div>
                </Link>
              ))}
              
              {/* Order CTA */}
              <Link
                href="/order"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-center space-x-2 p-4 mt-4 border border-white/30 rounded-lg hover:bg-white hover:text-black transition-colors duration-300 ${
                  isActive('/order') ? 'bg-white text-black' : 'text-white'
                }`}
              >
                <Palette className="w-5 h-5" />
                <span className="font-medium uppercase tracking-widest">Order Now</span>
              </Link>
            </div>

            {/* User Section */}
            <div className="border-t border-white/20 pt-6 mt-6 flex-shrink-0">
              {loading ? (
                <div className="flex justify-center py-4">
                  <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                </div>
              ) : user ? (
                <div className="space-y-3">
                  {/* User Info */}
                  <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-6 h-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-white font-medium truncate">{user.name || 'User'}</p>
                      <p className="text-gray-400 text-sm truncate">{user.email}</p>
                    </div>
                  </div>

                  {/* User Actions */}
                  <div className="space-y-1">
                    {userMenuItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center space-x-3 p-3 text-white hover:bg-white/10 transition-colors rounded-lg"
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </Link>
                    ))}

                    {user.role === 'ADMIN' && (
                      <Link
                        href="/admin"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center space-x-3 p-3 text-white hover:bg-white/10 transition-colors rounded-lg"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Admin Panel</span>
                      </Link>
                    )}

                    <button
                      onClick={handleSignOut}
                      className="flex items-center space-x-3 p-3 text-white hover:bg-white/10 transition-colors rounded-lg w-full text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="text-center mb-4">
                    <p className="text-gray-400 text-sm mb-3">Sign in to access your account</p>
                  </div>
                  <Link
                    href="/auth/signin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center space-x-2 p-3 bg-white text-black hover:bg-gray-200 transition-colors duration-300 rounded-lg font-medium"
                  >
                    <User className="w-4 h-4" />
                    <span>Sign In</span>
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