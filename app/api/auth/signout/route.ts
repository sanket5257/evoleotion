import { NextResponse } from 'next/server'
import { deleteSession } from '@/lib/session'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function POST() {
  try {
    // Delete the Supabase Auth session
    await deleteSession()

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
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}