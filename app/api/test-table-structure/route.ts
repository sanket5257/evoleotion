import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    if (!supabaseServer) {
      return NextResponse.json({ error: 'Database not available' }, { status: 500 })
    }

    // Test if order_images table exists by trying to select from it
    const { data, error } = await supabaseServer
      .from('order_images')
      .select('*')
      .limit(1)
    
    if (error) {
      return NextResponse.json({ 
        tableExists: false,
        error: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      })
    }

    // Test inserting a dummy record to check field names
    const testId = crypto.randomUUID()
    const { data: insertTest, error: insertError } = await supabaseServer
      .from('order_images')
      .insert({
        id: testId,
        orderId: 'test-order-id',
        imageUrl: 'test-url',
        publicId: 'test-public-id'
      })
      .select()

    if (insertError) {
      return NextResponse.json({
        tableExists: true,
        insertTest: false,
        insertError: insertError.message,
        code: insertError.code,
        details: insertError.details,
        hint: insertError.hint
      })
    }

    // Clean up test record
    await supabaseServer
      .from('order_images')
      .delete()
      .eq('id', testId)

    return NextResponse.json({
      tableExists: true,
      insertTest: true,
      message: 'order_images table exists and accepts inserts with correct field names',
      testData: insertTest
    })

  } catch (error) {
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}