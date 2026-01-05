import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { supabaseAdmin } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Check if clients are configured
    if (!supabase) {
      return NextResponse.json({
        success: false,
        error: 'Supabase client not configured',
        details: 'Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY'
      }, { status: 500 })
    }

    if (!supabaseAdmin) {
      return NextResponse.json({
        success: false,
        error: 'Supabase admin client not configured',
        details: 'Please check SUPABASE_SERVICE_ROLE_KEY'
      }, { status: 500 })
    }

    // Test basic connection
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1)

    if (error) {
      return NextResponse.json({
        success: false,
        error: 'Database connection failed',
        details: error.message
      }, { status: 500 })
    }

    // Test storage connection
    const { data: buckets, error: storageError } = await supabaseAdmin.storage.listBuckets()

    if (storageError) {
      return NextResponse.json({
        success: false,
        error: 'Storage connection failed',
        details: storageError.message
      }, { status: 500 })
    }

    const hasImagesBucket = buckets?.some(bucket => bucket.name === 'images')

    return NextResponse.json({
      success: true,
      message: 'Supabase connection successful',
      database: 'Connected',
      storage: 'Connected',
      imagesBucket: hasImagesBucket ? 'Found' : 'Not found - please create it',
      buckets: buckets?.map(b => b.name) || [],
      environment: {
        hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        url: process.env.NEXT_PUBLIC_SUPABASE_URL
      }
    })
  } catch (error) {
    console.error('Supabase test error:', error)
    return NextResponse.json({
      success: false,
      error: 'Connection test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}