import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

// Force dynamic rendering to prevent static evaluation during build
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  try {
    const { data: offers, error } = await supabaseServer
      .from('offers')
      .select('*')
      .order('priority', { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      count: offers?.length || 0,
      offers: offers || []
    })
  } catch (error) {
    console.error('Error fetching offers:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}