import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { supabaseServer } from '@/lib/supabase-server'

// Force dynamic rendering to prevent static evaluation during build
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin()

    // Check if database connection is available
    if (!supabaseServer) {
      return NextResponse.json(
        { error: 'Database connection not available' },
        { status: 500 }
      )
    }

    const { id } = params
    const body = await request.json()
    const { role } = body

    const validRoles = ['USER', 'ADMIN']
    
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
    }

    // Prevent users from removing their own admin role
    const session = request.headers.get('x-user-id')
    if (session === id && role !== 'ADMIN') {
      return NextResponse.json({ 
        error: 'Cannot remove your own admin privileges' 
      }, { status: 400 })
    }

    const { data: user, error } = await supabaseServer
      .from('users')
      .update({ 
        role,
        updatedAt: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating user role:', error)
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }
      return NextResponse.json({ error: 'Failed to update user role' }, { status: 500 })
    }

    return NextResponse.json(user)
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Error updating user role:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}