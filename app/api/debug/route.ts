import { NextResponse } from 'next/server'

export async function GET() {
  // Only allow in development or with a debug key
  if (process.env.NODE_ENV === 'production' && !process.env.DEBUG_KEY) {
    return NextResponse.json({ error: 'Not allowed' }, { status: 403 })
  }

  return NextResponse.json({
    nodeEnv: process.env.NODE_ENV,
    nextauthUrl: process.env.NEXTAUTH_URL ? 'Set' : 'Missing',
    nextauthSecret: process.env.NEXTAUTH_SECRET ? 'Set' : 'Missing',
    databaseUrl: process.env.DATABASE_URL ? 'Set' : 'Missing',
    vercelUrl: process.env.VERCEL_URL || 'Not set',
  })
}