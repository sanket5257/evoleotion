import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET() {
  // Step 1: Validate environment variables with detailed logging
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  console.log('Environment check:', {
    url: supabaseUrl ? 'SET' : 'MISSING',
    serviceKey: supabaseServiceKey ? 'SET' : 'MISSING',
    urlValue: supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : 'undefined'
  })

  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json({
      status: 'error',
      error: 'Missing Supabase configuration',
      details: {
        url: supabaseUrl ? 'SET' : 'MISSING',
        serviceKey: supabaseServiceKey ? 'SET' : 'MISSING'
      },
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }

  // Step 2: Validate URL format
  try {
    new URL(supabaseUrl)
  } catch (urlError) {
    return NextResponse.json({
      status: 'error',
      error: 'Invalid Supabase URL format',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }

  // Step 3: Create Supabase client with proper error handling
  let supabase
  try {
    supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  } catch (clientError) {
    console.error('Supabase client creation failed:', clientError)
    return NextResponse.json({
      status: 'error',
      error: 'Failed to create Supabase client',
      details: clientError instanceof Error ? clientError.message : 'Unknown client error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }

  // Step 4: Test connection with timeout and proper error handling
  try {
    console.log('Testing Supabase connection...')
    
    // Test with a simple query that should always work
    const { data, error, count } = await Promise.race([
      supabase
        .from('users')
        .select('*', { count: 'exact', head: true }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Connection timeout after 10 seconds')), 10000)
      )
    ]) as any

    if (error) {
      console.error('Supabase query error:', error)
      
      // Handle specific Supabase errors
      if (error.code === 'PGRST301') {
        return NextResponse.json({
          status: 'error',
          error: 'Table "users" not found - database may not be set up',
          details: error.message,
          timestamp: new Date().toISOString()
        }, { status: 500 })
      }

      if (error.code === '42P01') {
        return NextResponse.json({
          status: 'error',
          error: 'Database table does not exist',
          details: 'The users table has not been created yet',
          timestamp: new Date().toISOString()
        }, { status: 500 })
      }

      return NextResponse.json({
        status: 'error',
        error: 'Supabase query failed',
        details: {
          message: error.message,
          code: error.code,
          hint: error.hint
        },
        timestamp: new Date().toISOString()
      }, { status: 500 })
    }

    console.log('Supabase connection successful, user count:', count)

    return NextResponse.json({
      status: 'success',
      message: 'Supabase connection successful',
      data: {
        userCount: count || 0,
        connectionTest: 'passed'
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Supabase connection test failed:', error)
    
    // Handle different types of errors
    if (error instanceof Error) {
      if (error.message.includes('timeout')) {
        return NextResponse.json({
          status: 'error',
          error: 'Connection timeout',
          details: 'Supabase connection timed out after 10 seconds',
          timestamp: new Date().toISOString()
        }, { status: 408 })
      }

      if (error.message.includes('network') || error.message.includes('fetch')) {
        return NextResponse.json({
          status: 'error',
          error: 'Network error',
          details: 'Unable to reach Supabase servers',
          timestamp: new Date().toISOString()
        }, { status: 503 })
      }
    }

    return NextResponse.json({
      status: 'error',
      error: 'Unexpected error during connection test',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}