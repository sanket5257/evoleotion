'use client'

import { useState } from 'react'
import { User, Mail, Calendar, Shield, Edit, Save, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface User {
  id: string
  name: string | null
  email: string
  role: string
  createdAt: string
  _count: {
    orders: number
  }
}

interface ProfileManagerProps {
  user: User
}

export function ProfileManager({ user }: ProfileManagerProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email
  })

  const handleSave = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) throw new Error('Failed to update profile')

      setIsEditing(false)
      // Refresh the page to show updated data
      window.location.reload()
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Failed to update profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: user.name || '',
      email: user.email
    })
    setIsEditing(false)
  }

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-light tracking-wide">Profile Information</h2>
          {!isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              variant="ghost"
              className="flex items-center space-x-2"
            >
              <Edit className="w-4 h-4" />
              <span>Edit</span>
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button
                onClick={handleSave}
                disabled={loading}
                className="flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? 'Saving...' : 'Save'}</span>
              </Button>
              <Button
                onClick={handleCancel}
                variant="ghost"
                className="flex items-center space-x-2"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </Button>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              {isEditing ? (
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your full name"
                  className="bg-black border-white/20 text-white"
                />
              ) : (
                <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                  <User className="w-5 h-5 text-gray-400" />
                  <span>{user.name || 'Not set'}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              {isEditing ? (
                <Input
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  type="email"
                  className="bg-black border-white/20 text-white"
                />
              ) : (
                <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span>{user.email}</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Account Type
              </label>
              <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                <Shield className="w-5 h-5 text-gray-400" />
                <span className="capitalize">{user.role.toLowerCase()}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Member Since
              </label>
              <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span>{new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Account Stats */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-8">
        <h2 className="text-2xl font-light tracking-wide mb-6">Account Statistics</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-white/5 rounded-lg">
            <div className="text-3xl font-light mb-2">{user._count.orders}</div>
            <div className="text-gray-400 text-sm">Total Orders</div>
          </div>
          
          <div className="text-center p-6 bg-white/5 rounded-lg">
            <div className="text-3xl font-light mb-2">
              {Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
            </div>
            <div className="text-gray-400 text-sm">Days as Member</div>
          </div>
          
          <div className="text-center p-6 bg-white/5 rounded-lg">
            <div className="text-3xl font-light mb-2">
              {user._count.orders > 0 ? '⭐' : '🎨'}
            </div>
            <div className="text-gray-400 text-sm">
              {user._count.orders > 0 ? 'Valued Customer' : 'New Member'}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-8">
        <h2 className="text-2xl font-light tracking-wide mb-6">Quick Actions</h2>
        
        <div className="grid md:grid-cols-2 gap-4">
          <a
            href="/order"
            className="flex items-center justify-center space-x-2 p-4 border border-white/20 hover:border-white/40 transition-colors rounded-lg"
          >
            <span>🎨</span>
            <span>Order New Portrait</span>
          </a>
          
          <a
            href="/dashboard"
            className="flex items-center justify-center space-x-2 p-4 border border-white/20 hover:border-white/40 transition-colors rounded-lg"
          >
            <span>📋</span>
            <span>View My Orders</span>
          </a>
          
          <a
            href="/gallery"
            className="flex items-center justify-center space-x-2 p-4 border border-white/20 hover:border-white/40 transition-colors rounded-lg"
          >
            <span>🖼️</span>
            <span>Browse Gallery</span>
          </a>
          
          <a
            href="/contact"
            className="flex items-center justify-center space-x-2 p-4 border border-white/20 hover:border-white/40 transition-colors rounded-lg"
          >
            <span>💬</span>
            <span>Contact Support</span>
          </a>
        </div>
      </div>
    </div>
  )
}