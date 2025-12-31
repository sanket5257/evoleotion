'use client'

import { useSession } from 'next-auth/react'
import { useState } from 'react'

export function SessionDebug() {
  const { data: session, status } = useSession()
  const [serverSession, setServerSession] = useState(null)
  const [loading, setLoading] = useState(false)

  const checkServerSession = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/debug/session')
      const data = await response.json()
      setServerSession(data)
    } catch (error) {
      console.error('Error checking server session:', error)
    }
    setLoading(false)
  }

  if (process.env.NODE_ENV === 'production') {
    return null // Don't show in production
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h3 className="font-bold mb-2">Session Debug</h3>
      
      <div className="mb-2">
        <strong>Client Session:</strong>
        <pre className="text-xs overflow-auto max-h-32">
          {JSON.stringify({ status, session }, null, 2)}
        </pre>
      </div>

      <button
        onClick={checkServerSession}
        disabled={loading}
        className="bg-blue-600 px-2 py-1 rounded text-xs mb-2"
      >
        {loading ? 'Loading...' : 'Check Server Session'}
      </button>

      {serverSession && (
        <div>
          <strong>Server Session:</strong>
          <pre className="text-xs overflow-auto max-h-32">
            {JSON.stringify(serverSession, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}