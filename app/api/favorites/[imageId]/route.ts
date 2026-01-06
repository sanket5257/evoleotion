import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { supabaseServer } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

interface RouteParams {
  params: { imageId: string }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {

    // Check if database connection is available
    if (!supabaseServer) {
      return NextResponse.json(
        { error: 'Database connection not available' },
        { status: 500 }
      )
    }
    const session = await getSession()
    
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { imageId } = params

    if (!imageId) {
      return NextResponse.json({ error: 'Image ID is required' }, { status: 400 })
    }

    // Remove from favorites
    const { error } = await supabaseServer
      .from('user_favorites')
      .delete()
      .eq('userId', session.userId)
      .eq('imageId', imageId)

    if (error) {
      console.error('Error removing favorite:', error)
      return NextResponse.json({ error: 'Failed to remove favorite' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error removing favorite:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {

    // Check if database connection is available
    if (!supabaseServer) {
      return NextResponse.json(
        { error: 'Database connection not available' },
        { status: 500 }
      )
    }
    const session = await getSession()
    
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { imageId } = params

    const { data: favorite } = await supabaseServer
      .from('user_favorites')
      .select('*')
      .eq('userId', session.userId)
      .eq('imageId', imageId)
      .single()

    return NextResponse.json({ isFavorite: !!favorite })
  } catch (error) {
    console.error('Error checking favorite status:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}