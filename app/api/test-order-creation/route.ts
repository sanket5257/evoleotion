import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'
import { uploadToSupabase } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    console.log('=== Testing Order Creation Process ===')
    
    if (!supabaseServer) {
      return NextResponse.json({ error: 'Database not available' }, { status: 500 })
    }

    // Check if Supabase is configured
    const hasSupabaseConfig = !!(
      process.env.NEXT_PUBLIC_SUPABASE_URL && 
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
    
    console.log('Supabase config available:', hasSupabaseConfig)
    console.log('uploadToSupabase function available:', typeof uploadToSupabase === 'function')

    // Simulate creating a test order
    const orderId = crypto.randomUUID()
    const orderNumber = `TEST-${Date.now()}`
    
    console.log('Creating test order:', { orderId, orderNumber })

    // Create order
    const { data: order, error: orderError } = await supabaseServer
      .from('orders')
      .insert({
        id: orderId,
        orderNumber,
        userId: null, // Test order without user
        customerName: 'Test Customer',
        customerEmail: 'test@example.com',
        customerPhone: '1234567890',
        style: 'Portrait',
        size: 'A4',
        numberOfFaces: 1,
        basePrice: 100,
        discountAmount: 0,
        finalPrice: 100,
        updatedAt: new Date().toISOString()
      })
      .select()
      .single()

    if (orderError) {
      console.error('Order creation error:', orderError)
      return NextResponse.json({ error: 'Failed to create test order', details: orderError }, { status: 500 })
    }

    console.log('Order created successfully:', order.id)

    // Simulate uploaded images (placeholder data)
    const uploadedImages = [
      {
        secure_url: '/api/placeholder/400/500?name=test1.jpg',
        public_id: `test-${Date.now()}-1`
      },
      {
        secure_url: '/api/placeholder/400/500?name=test2.jpg', 
        public_id: `test-${Date.now()}-2`
      }
    ]

    console.log('Simulated uploaded images:', uploadedImages)

    // Create order images
    if (uploadedImages.length > 0) {
      const imagesToInsert = uploadedImages.map((upload) => ({
        id: crypto.randomUUID(),
        orderId: orderId,
        imageUrl: upload.secure_url,
        publicId: upload.public_id
      }))

      console.log('Inserting images:', imagesToInsert)

      const { data: insertedImages, error: imagesError } = await supabaseServer
        .from('order_images')
        .insert(imagesToInsert)
        .select()

      if (imagesError) {
        console.error('Images insertion error:', imagesError)
        return NextResponse.json({ 
          error: 'Failed to insert images', 
          details: imagesError,
          order: order,
          imagesToInsert: imagesToInsert
        }, { status: 500 })
      }

      console.log('Images inserted successfully:', insertedImages)

      // Verify the images were saved
      const { data: savedImages, error: verifyError } = await supabaseServer
        .from('order_images')
        .select('*')
        .eq('orderId', orderId)

      if (verifyError) {
        console.error('Verification error:', verifyError)
      } else {
        console.log('Verified saved images:', savedImages)
      }

      return NextResponse.json({
        success: true,
        message: 'Test order created successfully with images',
        order: order,
        insertedImages: insertedImages,
        savedImages: savedImages,
        debug: {
          hasSupabaseConfig,
          uploadFunctionAvailable: typeof uploadToSupabase === 'function',
          imagesToInsert
        }
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Test order created successfully (no images)',
      order: order
    })

  } catch (error) {
    console.error('Test order creation error:', error)
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}