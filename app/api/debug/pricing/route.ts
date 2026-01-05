import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

// Force dynamic rendering to prevent static evaluation during build
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  try {
    const { data: pricing, error } = await supabaseServer
      .from('pricing')
      .select('*')
      .order('style', { ascending: true })
      .order('size', { ascending: true })
      .order('numberOfFaces', { ascending: true })

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      count: pricing?.length || 0,
      pricing: pricing || []
    })
  } catch (error) {
    console.error('Error fetching pricing:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}