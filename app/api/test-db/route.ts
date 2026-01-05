import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Test basic database connection
    const result = await prisma.$queryRaw`SELECT 1 as test`
    
    // Test user table access
    const userCount = await prisma.user.count()
    
    return NextResponse.json({ 
      status: 'success',
      database: 'connected',
      userCount,
      testQuery: result,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Database test failed:', error)
    
    return NextResponse.json({ 
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}