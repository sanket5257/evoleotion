import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  const results = {
    timestamp: new Date().toISOString(),
    tests: [] as any[]
  }

  // Test 1: Basic connection
  try {
    const result = await prisma.$queryRaw`SELECT 1 as test`
    results.tests.push({
      name: 'Basic Connection',
      status: 'success',
      result
    })
  } catch (error) {
    results.tests.push({
      name: 'Basic Connection',
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }

  // Test 2: User table access
  try {
    const userCount = await prisma.user.count()
    results.tests.push({
      name: 'User Table Access',
      status: 'success',
      userCount
    })
  } catch (error) {
    results.tests.push({
      name: 'User Table Access',
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }

  // Test 3: Database info
  try {
    const dbInfo = await prisma.$queryRaw`SELECT version() as version, current_database() as database`
    results.tests.push({
      name: 'Database Info',
      status: 'success',
      info: dbInfo
    })
  } catch (error) {
    results.tests.push({
      name: 'Database Info',
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }

  // Test 4: Connection status
  try {
    await prisma.$connect()
    results.tests.push({
      name: 'Explicit Connect',
      status: 'success'
    })
  } catch (error) {
    results.tests.push({
      name: 'Explicit Connect',
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }

  const hasErrors = results.tests.some(test => test.status === 'failed')
  
  return NextResponse.json(results, { 
    status: hasErrors ? 500 : 200 
  })
}