import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Step 1: Environment validation
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({
        status: 'error',
        error: 'Missing environment variables',
        details: {
          url: supabaseUrl ? 'SET' : 'MISSING',
          serviceKey: supabaseServiceKey ? 'SET' : 'MISSING'
        }
      }, { status: 500 })
    }

    // Step 2: Create client
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Step 3: Test with a simple health check that doesn't require tables
    const { data, error } = await supabase
      .from('_supabase_health_check')
      .select('*')
      .limit(1)

    // This will fail, but we can check the error type
    if (error) {
      // If it's a "table not found" error, that's actually good - means connection works
      if (error.code === 'PGRST116' || error.message.includes('does not exist')) {
        return NextResponse.json({
          status: 'success',
          message: 'Supabase connection working (table not found is expected)',
          connectionTest: 'passed',
          timestamp: new Date().toISOString()
        })
      }

      // Other errors indicate real connection issues
      return NextResponse.json({
        status: 'error',
        error: 'Supabase connection failed',
        details: {
          code: error.code,
          message: error.message,
          hint: error.hint
        },
        timestamp: new Date().toISOString()
      }, { status: 500 })
    }

    return NextResponse.json({
      status: 'success',
      message: 'Supabase connection successful',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Supabase test error:', error)
    
    return NextResponse.json({
      status: 'error',
      error: 'Connection test failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}