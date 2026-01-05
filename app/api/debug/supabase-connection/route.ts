import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

// Force dynamic rendering to prevent static evaluation during build
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  try {
    // Test basic Supabase connection
    const startTime = Date.now()
    
    // Test 1: Simple query
    const { data: testData, error: testError } = await supabaseServer
      .from('users')
      .select('id')
      .limit(1)

    const queryTime = Date.now() - startTime

    if (testError) {
      return NextResponse.json({
        success: false,
        error: 'Supabase connection failed',
        details: {
          code: testError.code || 'unknown',
          message: testError.message || 'Unknown error',
          hint: testError.hint || null
        },
        queryTime,
        timestamp: new Date().toISOString()
      }, { status: 500 })
    }

    // Test 2: Check pricing table
    const { data: pricingData, error: pricingError } = await supabaseServer
      .from('pricing')
      .select('id')
      .limit(1)

    // Test 3: Check offers table
    const { data: offersData, error: offersError } = await supabaseServer
      .from('offers')
      .select('id')
      .limit(1)

    return NextResponse.json({
      success: true,
      tests: {
        userTable: {
          success: !testError,
          error: testError ? testError.message || 'Unknown error' : null,
          hasData: !!testData && testData.length > 0
        },
        pricingTable: {
          success: !pricingError,
          error: pricingError ? pricingError.message || 'Unknown error' : null,
          hasData: !!pricingData && pricingData.length > 0
        },
        offersTable: {
          success: !offersError,
          error: offersError ? offersError.message || 'Unknown error' : null,
          hasData: !!offersData && offersData.length > 0
        }
      },
      queryTime,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Supabase connection test error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}