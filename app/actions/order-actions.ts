'use server'

import { getSession } from '@/lib/session'
import { supabaseServer } from '@/lib/supabase-server'
import { uploadToSupabase } from '@/lib/supabase-server'
import { generateOrderNumber, generateWhatsAppUrl } from '@/lib/utils'
import { orderSchema } from '@/lib/validations'

export async function createOrder(formData: FormData) {
  try {
    // Get current session to associate order with user
    const session = await getSession()
    
    if (!session?.userId) {
      return {
        success: false,
        error: 'Authentication required. Please sign in and try again.',
        requiresAuth: true, // Flag to indicate auth issue
      }
    }
    
    // Validate session is not expired
    if (session.expiresAt) {
      const expiresAt = new Date(session.expiresAt)
      if (expiresAt < new Date()) {
        return {
          success: false,
          error: 'Your session has expired. Please sign in again.',
          requiresAuth: true,
        }
      }
    }
    
    // Extract and validate form data
    const data = {
      customerName: formData.get('customerName') as string,
      customerEmail: formData.get('customerEmail') as string,
      customerPhone: formData.get('customerPhone') as string,
      style: formData.get('style') as string,
      size: formData.get('size') as string,
      numberOfFaces: parseInt(formData.get('numberOfFaces') as string) || 1,
      ...(formData.get('specialNotes') && { specialNotes: formData.get('specialNotes') as string }),
      ...(formData.get('couponCode') && { couponCode: formData.get('couponCode') as string }),
    }

    // Basic validation
    if (!data.customerName?.trim() || !data.customerEmail?.trim() || !data.customerPhone?.trim()) {
      return {
        success: false,
        error: 'Please fill in all required customer information fields.',
      }
    }

    if (!data.style || !data.size) {
      return {
        success: false,
        error: 'Please select both art style and size.',
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.customerEmail)) {
      return {
        success: false,
        error: 'Please enter a valid email address.',
      }
    }

    // Validate form data with schema if available
    let validatedData = data
    try {
      if (typeof orderSchema !== 'undefined') {
        validatedData = orderSchema.parse(data)
      }
    } catch (validationError) {
      return {
        success: false,
        error: 'Invalid form data. Please check all required fields.',
      }
    }

    // Extract and validate price data
    const basePrice = parseFloat(formData.get('basePrice') as string) || 0
    const discountAmount = parseFloat(formData.get('discountAmount') as string) || 0
    const finalPrice = parseFloat(formData.get('finalPrice') as string) || 0
    const offerId = formData.get('offerId') as string || undefined

    if (basePrice <= 0 || finalPrice <= 0) {
      return {
        success: false,
        error: 'Invalid pricing information. Please refresh and try again.',
      }
    }

    // Check for images
    const imageUploads = []
    let imageIndex = 0
    
    while (formData.get(`image-${imageIndex}`)) {
      const file = formData.get(`image-${imageIndex}`) as File
      if (file && file.size > 0) {
        // Validate file size and type
        if (file.size > 10 * 1024 * 1024) { // 10MB limit
          return {
            success: false,
            error: `Image ${imageIndex + 1} is too large. Please use images under 10MB.`,
          }
        }
        
        if (!file.type.startsWith('image/')) {
          return {
            success: false,
            error: `File ${imageIndex + 1} is not a valid image format.`,
          }
        }
        
        imageUploads.push(file)
      }
      imageIndex++
    }

    if (imageUploads.length === 0) {
      return {
        success: false,
        error: 'Please upload at least one image.',
      }
    }

    // Upload images to Supabase (with fallback)
    let uploadedImages: Array<{ secure_url: string; public_id: string }> = []
    
    try {
      // Check if Supabase is configured
      const hasSupabaseConfig = !!(
        process.env.NEXT_PUBLIC_SUPABASE_URL && 
        process.env.SUPABASE_SERVICE_ROLE_KEY
      )

      if (hasSupabaseConfig && typeof uploadToSupabase === 'function') {
        // Upload to Supabase with timeout
        const uploadPromises = imageUploads.map(async (file, index) => {
          try {
            return await Promise.race([
              uploadToSupabase(file, 'orders'),
              new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Upload timeout')), 30000)
              )
            ]) as { secure_url: string; public_id: string }
          } catch (uploadError) {
            console.warn(`Failed to upload image ${index}:`, uploadError)
            // Return placeholder for failed uploads
            return {
              secure_url: `/api/placeholder/400/500?name=${encodeURIComponent(file.name)}`,
              public_id: `placeholder-${Date.now()}-${index}`,
            }
          }
        })
        
        uploadedImages = await Promise.all(uploadPromises)
      } else {
        // Create placeholder image entries when Supabase is not configured
        uploadedImages = imageUploads.map((file, index) => ({
          secure_url: `/api/placeholder/400/500?name=${encodeURIComponent(file.name)}`,
          public_id: `placeholder-${Date.now()}-${index}`,
        }))
      }
    } catch (uploadError) {
      console.error('Image upload error:', uploadError)
      // Continue with placeholder images instead of failing
      uploadedImages = imageUploads.map((file, index) => ({
        secure_url: `/api/placeholder/400/500?name=${encodeURIComponent(file.name)}`,
        public_id: `placeholder-${Date.now()}-${index}`,
      }))
    }

    // Generate order number
    const orderNumber = generateOrderNumber()

    // Create order in database with timeout
    try {
      const orderId = crypto.randomUUID()
      
      // Create order
      const { data: order, error: orderError } = await supabaseServer
        .from('orders')
        .insert({
          id: orderId,
          orderNumber,
          userId: session.userId,
          customerName: validatedData.customerName,
          customerEmail: validatedData.customerEmail,
          customerPhone: validatedData.customerPhone,
          style: validatedData.style,
          size: validatedData.size,
          numberOfFaces: validatedData.numberOfFaces,
          specialNotes: validatedData.specialNotes || null,
          basePrice,
          discountAmount,
          finalPrice,
          offerId,
          couponCode: validatedData.couponCode || null,
          updatedAt: new Date().toISOString()
        })
        .select()
        .single()

      if (orderError) {
        throw orderError
      }

      // Create order images
      if (uploadedImages.length > 0) {
        const { error: imagesError } = await supabaseServer
          .from('order_images')
          .insert(
            uploadedImages.map((upload) => ({
              id: crypto.randomUUID(),
              orderId: orderId,
              imageUrl: upload.secure_url,
              publicId: upload.public_id,
              updatedAt: new Date().toISOString()
            }))
          )

        if (imagesError) {
          console.error('Error creating order images:', imagesError)
          // Continue without failing the order creation
        }
      }

      return {
        success: true,
        orderId: order.id,
        orderNumber: order.orderNumber,
      }
    } catch (dbError) {
      console.error('Database error:', dbError)
      
      if (dbError instanceof Error) {
        if (dbError.message.includes('timeout')) {
          return {
            success: false,
            error: 'Database is taking too long to respond. Please try again.',
          }
        }
        if (dbError.message.includes('connection')) {
          return {
            success: false,
            error: 'Database connection error. Please try again later.',
          }
        }
      }
      
      return {
        success: false,
        error: 'Failed to save order. Please try again.',
      }
    }
  } catch (error) {
    console.error('Order creation error:', error)
    
    if (error instanceof Error) {
      if (error.message.includes('timeout')) {
        return {
          success: false,
          error: 'Request timed out. Please try again.',
        }
      }
      if (error.message.includes('network')) {
        return {
          success: false,
          error: 'Network error. Please check your connection and try again.',
        }
      }
    }
    
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.',
    }
  }
}

export async function getOrderForWhatsApp(orderId: string) {
  try {
    if (!orderId || typeof orderId !== 'string') {
      return {
        success: false,
        error: 'Invalid order ID',
      }
    }

    // Get order
    const { data: order, error: orderError } = await supabaseServer
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single()

    if (orderError || !order) {
      return {
        success: false,
        error: 'Order not found',
      }
    }

    // Get admin settings for WhatsApp number with fallback
    let whatsappNumber = '1234567890' // Default fallback
    
    try {
      const { data: settings } = await supabaseServer
        .from('admin_settings')
        .select('*')
        .limit(1)
        .single()
      
      whatsappNumber = settings?.whatsappNumber || whatsappNumber
    } catch (settingsError) {
      console.warn('Failed to get admin settings, using default WhatsApp number:', settingsError)
    }

    // Generate WhatsApp URL with error handling
    let whatsappUrl = ''
    try {
      whatsappUrl = generateWhatsAppUrl(whatsappNumber, {
        orderNumber: order.orderNumber || 'N/A',
        customerName: order.customerName || 'Customer',
        style: order.style || 'Portrait',
        size: order.size || 'Standard',
        numberOfFaces: order.numberOfFaces || 1,
        finalPrice: order.finalPrice || 0,
      })
    } catch (urlError) {
      console.error('WhatsApp URL generation error:', urlError)
      // Fallback URL
      whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        `Hi! I've placed an order (${order.orderNumber}) on your portrait website. Please share payment instructions.`
      )}`
    }

    return {
      success: true,
      whatsappUrl,
      order: {
        orderNumber: order.orderNumber,
        finalPrice: order.finalPrice,
      }
    }
  } catch (error) {
    console.error('WhatsApp URL generation error:', error)
    return {
      success: false,
      error: 'Failed to generate WhatsApp link. Please contact us directly.',
    }
  }
}