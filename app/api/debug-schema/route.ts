import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Check if database connection is available
    if (!supabaseServer) {
      return NextResponse.json(
        { error: 'Database connection not available' },
        { status: 500 }
      )
    }

    // Get one order to see the actual field names
    const { data: orders, error: ordersError } = await supabaseServer
      .from('orders')
      .select('*')
      .limit(1)
    
    if (ordersError) {
      return NextResponse.json({ 
        error: 'Failed to fetch orders', 
        details: ordersError 
      }, { status: 500 })
    }

    // Get one order image to see the actual field names
    const { data: images, error: imagesError } = await supabaseServer
      .from('order_images')
      .select('*')
      .limit(1)
    
    if (imagesError) {
      return NextResponse.json({ 
        error: 'Failed to fetch order images', 
        details: imagesError 
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      results: {
        orderFields: orders?.[0] ? Object.keys(orders[0]) : [],
        orderSample: orders?.[0] || null,
        imageFields: images?.[0] ? Object.keys(images[0]) : [],
        imageSample: images?.[0] || null
      }
    })

  } catch (error) {
    console.error('Debug error:', error)
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}