'use client'

import { useState } from 'react'
import { Eye, Edit, Trash2, Shield, User, Mail, Phone, Calendar, MoreVertical, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface User {
  id: string
  name: string | null
  email: string
  role: string
  createdAt: string
  updatedAt: string
  emailVerified: string | null
  image: string | null
}

interface UsersManagerProps {
  users: User[]
}

const ROLE_OPTIONS = [
  { value: 'USER', label: 'User' },
  { value: 'ADMIN', label: 'Admin' },
]

const roleColors = {
  USER: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  ADMIN: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
}

export function UsersManager({ users }: UsersManagerProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [roleFilter, setRoleFilter] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  const [showCreateUser, setShowCreateUser] = useState(false)
  const [createUserData, setCreateUserData] = useState({
    name: '',
    email: '',
    role: 'USER'
  })

  // Filter users
  const filteredUsers = users.filter(user => {
    if (roleFilter && user.role !== roleFilter) return false
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        user.name?.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
      )
    }
    return true
  })

  const handleRoleUpdate = async (userId: string, role: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role })
      })
      
      if (!response.ok) throw new Error('Failed to update user role')
      
      // Refresh the page to show updated data
      window.location.reload()
    } catch (error) {
      console.error('Error updating user role:', error)
      alert('Failed to update user role. Please try again.')
    }
  }

  const handleDeleteUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) throw new Error('Failed to delete user')
      
      // Refresh the page to show updated data
      window.location.reload()
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('Failed to delete user. Please try again.')
    }
  }

  const handleCreateUser = async () => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createUserData)
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create user')
      }
      
      // Reset form and close modal
      setCreateUserData({ name: '', email: '', role: 'USER' })
      setShowCreateUser(false)
      
      // Refresh the page to show updated data
      window.location.reload()
    } catch (error) {
      console.error('Error creating user:', error)
      alert(error instanceof Error ? error.message : 'Failed to create user. Please try again.')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-64">
          <Input
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        
        <Select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          options={[
            { value: '', label: 'All Roles' },
            ...ROLE_OPTIONS
          ]}
        />

        <Button
          onClick={() => setShowCreateUser(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Create User
        </Button>

        <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
          Showing {filteredUsers.length} of {users.length} users
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {user.image ? (
                          <img
                            className="h-10 w-10 rounded-full"
                            src={user.image}
                            alt={user.name || 'User'}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                            <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.name || 'No name'}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          ID: {user.id.slice(0, 8)}...
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {user.email}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {user.emailVerified ? (
                        <span className="text-green-600 dark:text-green-400">✓ Verified</span>
                      ) : (
                        <span className="text-yellow-600 dark:text-yellow-400">⚠ Unverified</span>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className={roleColors[user.role as keyof typeof roleColors]}>
                      {user.role === 'ADMIN' ? (
                        <><Shield className="w-3 h-3 mr-1" /> Admin</>
                      ) : (
                        <><User className="w-3 h-3 mr-1" /> User</>
                      )}
                    </Badge>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(user.createdAt)}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      Active
                    </Badge>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedUser(user)}
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setShowDeleteConfirm(user.id)}
                        className="text-red-600 hover:text-red-700"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <User className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No users found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {searchQuery || roleFilter ? 'Try adjusting your search or filters' : 'No users have registered yet'}
          </p>
        </div>
      )}

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  User Details
                </h3>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedUser(null)}
                >
                  ✕
                </Button>
              </div>

              <div className="space-y-6">
                {/* User Info */}
                <div className="flex items-center space-x-4">
                  {selectedUser.image ? (
                    <img
                      className="h-16 w-16 rounded-full"
                      src={selectedUser.image}
                      alt={selectedUser.name || 'User'}
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                      <User className="w-8 h-8 text-gray-500 dark:text-gray-400" />
                    </div>
                  )}
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {selectedUser.name || 'No name'}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">{selectedUser.email}</p>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="text-lg font-semibold mb-3">Account Information</h5>
                    <div className="space-y-2">
                      <p><strong>User ID:</strong> {selectedUser.id}</p>
                      <p><strong>Email:</strong> {selectedUser.email}</p>
                      <p><strong>Email Verified:</strong> {selectedUser.emailVerified ? 'Yes' : 'No'}</p>
                      <p><strong>Role:</strong> {selectedUser.role}</p>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-lg font-semibold mb-3">Timestamps</h5>
                    <div className="space-y-2">
                      <p><strong>Joined:</strong> {formatDate(selectedUser.createdAt)}</p>
                      <p><strong>Last Updated:</strong> {formatDate(selectedUser.updatedAt)}</p>
                    </div>
                  </div>
                </div>

                {/* Role Management */}
                <div>
                  <h5 className="text-lg font-semibold mb-3">Role Management</h5>
                  <Select
                    label="User Role"
                    value={selectedUser.role}
                    onChange={(e) => handleRoleUpdate(selectedUser.id, e.target.value)}
                    options={ROLE_OPTIONS}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Delete User
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to delete this user? This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    handleDeleteUser(showDeleteConfirm)
                    setShowDeleteConfirm(null)
                  }}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Create User Modal */}
      {showCreateUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Create New User
                </h3>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowCreateUser(false)
                    setCreateUserData({ name: '', email: '', role: 'USER' })
                  }}
                >
                  ✕
                </Button>
              </div>

              <div className="space-y-4">
                <Input
                  label="Full Name"
                  value={createUserData.name}
                  onChange={(e) => setCreateUserData({ ...createUserData, name: e.target.value })}
                  placeholder="Enter user's full name"
                />

                <Input
                  label="Email Address"
                  type="email"
                  value={createUserData.email}
                  onChange={(e) => setCreateUserData({ ...createUserData, email: e.target.value })}
                  placeholder="Enter user's email"
                  required
                />

                <Select
                  label="Role"
                  value={createUserData.role}
                  onChange={(e) => setCreateUserData({ ...createUserData, role: e.target.value })}
                  options={ROLE_OPTIONS}
                />
              </div>

              <div className="flex space-x-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCreateUser(false)
                    setCreateUserData({ name: '', email: '', role: 'USER' })
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateUser}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={!createUserData.email}
                >
                  Create User
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}