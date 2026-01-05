import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    console.log('Testing Supabase schema...')

    // Check if Supabase admin client is configured
    if (!supabaseAdmin) {
      return NextResponse.json({
        status: 'error',
        error: 'Supabase admin client not configured',
        message: 'Please check environment variables',
        timestamp: new Date().toISOString()
      }, { status: 500 })
    }

    // Test each table by trying to select from it
    const tables = [
      'users',
      'gallery_images', 
      'pricing',
      'offers',
      'orders',
      'order_images',
      'user_favorites',
      'admin_settings'
    ]

    const results: Record<string, any> = {}

    for (const table of tables) {
      try {
        const { data, error } = await supabaseAdmin
          .from(table)
          .select('*')
          .limit(1)

        if (error) {
          results[table] = { exists: false, error: error.message }
        } else {
          results[table] = { exists: true, hasData: data && data.length > 0 }
        }
      } catch (err) {
        results[table] = { exists: false, error: err instanceof Error ? err.message : 'Unknown error' }
      }
    }

    return NextResponse.json({
      status: 'success',
      message: 'Schema test complete',
      tables: results,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Schema test error:', error)
    return NextResponse.json({
      status: 'error',
      error: 'Schema test failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}