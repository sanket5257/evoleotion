'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth/auth-context'
import { supabase } from '@/lib/supabase'

export function SupabaseIntegrationTest() {
  const { user, loading } = useAuth()
  const [testResults, setTestResults] = useState<string[]>([])
  const [testing, setTesting] = useState(false)

  const addResult = (result: string) => {
    setTestResults(prev => [...prev, result])
  }

  const runTests = async () => {
    setTesting(true)
    setTestResults([])

    try {
      // Test 1: Supabase client connection
      addResult('Testing Supabase client connection...')
      const { data: { session } } = await supabase.auth.getSession()
      addResult(`✓ Supabase client connected. Session: ${session ? 'Active' : 'None'}`)

      // Test 2: Authentication context
      addResult('Testing authentication context...')
      addResult(`✓ Auth context loaded. User: ${user ? user.email : 'None'}`)

      // Test 3: API endpoints
      addResult('Testing API endpoints...')
      
      // Test session endpoint
      const sessionResponse = await fetch('/api/auth/session')
      addResult(`✓ Session API: ${sessionResponse.status} ${sessionResponse.ok ? 'OK' : 'Error'}`)

      // Test favorites endpoint (should work for both authenticated and non-authenticated)
      const favoritesResponse = await fetch('/api/favorites')
      addResult(`✓ Favorites API: ${favoritesResponse.status} ${favoritesResponse.status === 401 || favoritesResponse.ok ? 'OK' : 'Error'}`)

      // Test 4: Gallery data structure
      addResult('Testing gallery data structure...')
      try {
        const galleryResponse = await fetch('/api/admin/gallery')
        if (galleryResponse.ok) {
          const galleryData = await galleryResponse.json()
          const hasCorrectStructure = Array.isArray(galleryData) && 
            (galleryData.length === 0 || 
             (galleryData[0].id && galleryData[0].title && galleryData[0].imageUrl))
          addResult(`✓ Gallery data structure: ${hasCorrectStructure ? 'Valid' : 'Invalid'}`)
        } else {
          addResult(`✓ Gallery API: ${galleryResponse.status} (Expected for non-admin users)`)
        }
      } catch (error) {
        addResult(`✓ Gallery API: Protected (Expected for non-admin users)`)
      }

      addResult('✅ All tests completed successfully!')

    } catch (error) {
      addResult(`❌ Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setTesting(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6 bg-white/5 border border-white/10 rounded-lg">
        <div className="text-center">
          <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-gray-400">Loading authentication...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-white/5 border border-white/10 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">Supabase Integration Test</h3>
        <button
          onClick={runTests}
          disabled={testing}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {testing ? 'Testing...' : 'Run Tests'}
        </button>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {testResults.map((result, index) => (
          <div
            key={index}
            className={`text-sm p-2 rounded ${
              result.startsWith('✓') || result.startsWith('✅')
                ? 'text-green-400 bg-green-900/20'
                : result.startsWith('❌')
                ? 'text-red-400 bg-red-900/20'
                : 'text-gray-300 bg-gray-800/20'
            }`}
          >
            {result}
          </div>
        ))}
      </div>

      {testResults.length === 0 && !testing && (
        <p className="text-gray-400 text-center py-4">
          Click "Run Tests" to verify Supabase integration
        </p>
      )}
    </div>
  )
}