import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { supabaseServer } from '@/lib/supabase-server'

// Force dynamic rendering to prevent static evaluation during build
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function DELETE(
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

    // Prevent users from deleting their own account
    const session = request.headers.get('x-user-id')
    if (session === id) {
      return NextResponse.json({ 
        error: 'Cannot delete your own account' 
      }, { status: 400 })
    }

    // Check if user exists and get their info
    const { data: existingUser, error: fetchError } = await supabaseServer
      .from('users')
      .select('id, role, email')
      .eq('id', id)
      .single()

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }
      return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 })
    }

    // Prevent deleting the last admin user
    if (existingUser.role === 'ADMIN') {
      const { count: adminCount } = await supabaseServer
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'ADMIN')

      if (adminCount && adminCount <= 1) {
        return NextResponse.json({ 
          error: 'Cannot delete the last admin user' 
        }, { status: 400 })
      }
    }

    // Delete user
    const { error } = await supabaseServer
      .from('users')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting user:', error)
      return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'User deleted successfully' 
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Error deleting user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(
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

    const { data: user, error } = await supabaseServer
      .from('users')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching user:', error)
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }
      return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 })
    }

    return NextResponse.json(user)
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Error fetching user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}