import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({
        status: 'error',
        error: 'Missing environment variables'
      }, { status: 500 })
    }

    console.log('Testing basic Supabase connection...')
    
    // Create client
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Test 1: Try to access Supabase REST API directly (no tables needed)
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/`, {
        headers: {
          'apikey': supabaseServiceKey,
          'Authorization': `Bearer ${supabaseServiceKey}`
        }
      })

      console.log('REST API response status:', response.status)

      if (response.status === 200) {
        return NextResponse.json({
          status: 'success',
          message: 'Supabase REST API is reachable',
          apiStatus: response.status,
          timestamp: new Date().toISOString()
        })
      } else {
        const errorText = await response.text()
        return NextResponse.json({
          status: 'error',
          error: 'Supabase API returned error',
          details: {
            status: response.status,
            statusText: response.statusText,
            body: errorText
          },
          timestamp: new Date().toISOString()
        }, { status: 500 })
      }
    } catch (fetchError) {
      console.error('Fetch error:', fetchError)
      return NextResponse.json({
        status: 'error',
        error: 'Cannot reach Supabase API',
        details: fetchError instanceof Error ? fetchError.message : 'Unknown fetch error',
        timestamp: new Date().toISOString()
      }, { status: 500 })
    }

  } catch (error) {
    console.error('Connection test failed:', error)
    return NextResponse.json({
      status: 'error',
      error: 'Connection test failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}