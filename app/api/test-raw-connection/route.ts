import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Test if we can parse the DATABASE_URL
    const dbUrl = process.env.DATABASE_URL
    if (!dbUrl) {
      return NextResponse.json({
        status: 'error',
        error: 'DATABASE_URL not found'
      }, { status: 500 })
    }

    // Parse the URL
    const url = new URL(dbUrl)
    
    return NextResponse.json({
      status: 'info',
      connection: {
        host: url.hostname,
        port: url.port,
        database: url.pathname.slice(1),
        username: url.username,
        hasPassword: !!url.password,
        searchParams: Object.fromEntries(url.searchParams.entries())
      },
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