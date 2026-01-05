import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const results = {
    timestamp: new Date().toISOString(),
    tests: [] as any[]
  }

  // Test 1: Supabase API endpoint
  try {
    const response = await fetch('https://wcytdeycgdulgnxkdjgh.supabase.co/rest/v1/', {
      headers: {
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''}`
      }
    })
    
    results.tests.push({
      name: 'Supabase API Endpoint',
      status: response.ok ? 'success' : 'failed',
      statusCode: response.status,
      statusText: response.statusText
    })
  } catch (error) {
    results.tests.push({
      name: 'Supabase API Endpoint',
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }

  // Test 2: DNS Resolution
  try {
    const response = await fetch('https://wcytdeycgdulgnxkdjgh.supabase.co', {
      method: 'HEAD'
    })
    
    results.tests.push({
      name: 'DNS Resolution',
      status: 'success',
      statusCode: response.status
    })
  } catch (error) {
    results.tests.push({
      name: 'DNS Resolution',
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }

  // Test 3: Environment Variables
  results.tests.push({
    name: 'Environment Check',
    status: 'info',
    variables: {
      DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'MISSING',
      SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'MISSING',
      SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'MISSING'
    }
  })

  return NextResponse.json(results)
}