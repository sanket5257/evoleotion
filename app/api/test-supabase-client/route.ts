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
        error: 'Missing Supabase configuration',
        config: {
          url: supabaseUrl ? 'SET' : 'MISSING',
          serviceKey: supabaseServiceKey ? 'SET' : 'MISSING'
        }
      }, { status: 500 })
    }

    // Create Supabase client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Test 1: Basic connection
    const { data: testData, error: testError } = await supabase
      .from('users')
      .select('count', { count: 'exact', head: true })

    if (testError) {
      return NextResponse.json({
        status: 'error',
        error: 'Supabase query failed',
        details: testError.message,
        timestamp: new Date().toISOString()
      }, { status: 500 })
    }

    // Test 2: Try to get user count
    const { count } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })

    return NextResponse.json({
      status: 'success',
      message: 'Supabase connection successful',
      userCount: count,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}