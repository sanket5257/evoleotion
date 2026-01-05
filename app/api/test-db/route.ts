import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const results = {
    timestamp: new Date().toISOString(),
    tests: [] as any[]
  }

  // Test 1: Basic connection
  try {
    const { data, error } = await supabaseServer
      .from('users')
      .select('id')
      .limit(1)
    
    if (error) throw error
    
    results.tests.push({
      name: 'Basic Connection',
      status: 'success',
      result: 'Connected successfully'
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
    const { count, error } = await supabaseServer
      .from('users')
      .select('*', { count: 'exact', head: true })
    
    if (error) throw error
    
    results.tests.push({
      name: 'User Table Access',
      status: 'success',
      userCount: count || 0
    })
  } catch (error) {
    results.tests.push({
      name: 'User Table Access',
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }

  // Test 3: Gallery table access
  try {
    const { count, error } = await supabaseServer
      .from('gallery_images')
      .select('*', { count: 'exact', head: true })
    
    if (error) throw error
    
    results.tests.push({
      name: 'Gallery Table Access',
      status: 'success',
      imageCount: count || 0
    })
  } catch (error) {
    results.tests.push({
      name: 'Gallery Table Access',
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }

  // Test 4: Orders table access
  try {
    const { count, error } = await supabaseServer
      .from('orders')
      .select('*', { count: 'exact', head: true })
    
    if (error) throw error
    
    results.tests.push({
      name: 'Orders Table Access',
      status: 'success',
      orderCount: count || 0
    })
  } catch (error) {
    results.tests.push({
      name: 'Orders Table Access',
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }

  const hasErrors = results.tests.some(test => test.status === 'failed')
  
  return NextResponse.json(results, { 
    status: hasErrors ? 500 : 200 
  })
}