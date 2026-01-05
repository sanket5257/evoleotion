import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function POST() {
  try {
    console.log('Sign out API called')
    
    // Clear the session cookie
    const cookieStore = cookies()
    
    try {
      cookieStore.set('session-token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0, // Expire immediately
        path: '/'
      })
      console.log('Session cookie cleared')
    } catch (cookieError) {
      console.error('Failed to clear session cookie:', cookieError)
    }

    return NextResponse.json({
      success: true,
      message: 'Signed out successfully'
    }, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  } catch (error) {
    console.error('Sign out error:', error)
    return NextResponse.json(
      { error: 'Sign out failed' },
      { status: 500 }
    )
  }
}