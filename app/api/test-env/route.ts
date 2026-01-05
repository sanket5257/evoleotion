import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const envCheck = {
      NODE_ENV: process.env.NODE_ENV,
      DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'MISSING',
      JWT_SECRET: process.env.JWT_SECRET ? 'SET' : 'MISSING',
      VERCEL: process.env.VERCEL ? 'true' : 'false',
      VERCEL_ENV: process.env.VERCEL_ENV || 'not-set'
    }
    
    return NextResponse.json({ 
      status: 'success',
      environment: envCheck,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Environment test failed:', error)
    
    return NextResponse.json({ 
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}