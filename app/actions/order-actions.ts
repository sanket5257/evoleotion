'use server'

import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { uploadToCloudinary } from '@/lib/cloudinary'
import { generateOrderNumber, generateWhatsAppUrl } from '@/lib/utils'
import { orderSchema } from '@/lib/validations'
import { redirect } from 'next/navigation'

export async function createOrder(formData: FormData) {
  try {
    console.log('Starting order creation...')
    
    // Get current session to associate order with user
    const session = await getSession()
    console.log('Session:', session ? 'Found' : 'Not found')
    
    // Extract form data
    const data = {
      customerName: formData.get('customerName') as string,
      customerEmail: formData.get('customerEmail') as string,
      customerPhone: formData.get('customerPhone') as string,
      style: formData.get('style') as string,
      size: formData.get('size') as string,
      numberOfFaces: parseInt(formData.get('numberOfFaces') as string),
      specialNotes: formData.get('specialNotes') as string || undefined,
      couponCode: formData.get('couponCode') as string || undefined,
    }

    console.log('Form data extracted:', data)

    // Validate form data
    let validatedData
    try {
      validatedData = orderSchema.parse(data)
      console.log('Validation successful')
    } catch (validationError) {
      console.error('Validation error:', validationError)
      return {
        success: false,
        error: 'Invalid form data. Please check all required fields.',
      }
    }

    // Extract price data
    const basePrice = parseFloat(formData.get('basePrice') as string)
    const discountAmount = parseFloat(formData.get('discountAmount') as string)
    const finalPrice = parseFloat(formData.get('finalPrice') as string)
    const offerId = formData.get('offerId') as string || undefined

    console.log('Price data:', { basePrice, discountAmount, finalPrice, offerId })

    // Check for images
    const imageUploads = []
    let imageIndex = 0
    
    while (formData.get(`image-${imageIndex}`)) {
      const file = formData.get(`image-${imageIndex}`) as File
      if (file && file.size > 0) {
        console.log(`Found image ${imageIndex}:`, file.name, file.size)
        imageUploads.push(file)
      }
      imageIndex++
    }

    console.log(`Found ${imageUploads.length} images to upload`)

    // Upload images to Cloudinary (if configured)
    let uploadedImages: Array<{ secure_url: string; public_id: string }> = []
    if (imageUploads.length > 0) {
      try {
        // Check if Cloudinary is configured
        if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
          console.warn('Cloudinary not configured, skipping image upload')
          // Create placeholder image entries
          uploadedImages = imageUploads.map((file, index) => ({
            secure_url: `/api/placeholder/400/500?name=${encodeURIComponent(file.name)}`,
            public_id: `placeholder-${Date.now()}-${index}`,
          }))
        } else {
          console.log('Uploading images to Cloudinary...')
          const uploads = imageUploads.map(file => uploadToCloudinary(file, 'orders'))
          uploadedImages = await Promise.all(uploads) as Array<{ secure_url: string; public_id: string }>
          console.log('Images uploaded successfully')
        }
      } catch (uploadError) {
        console.error('Image upload error:', uploadError)
        // Continue with placeholder images instead of failing
        uploadedImages = imageUploads.map((file, index) => ({
          secure_url: `/api/placeholder/400/500?name=${encodeURIComponent(file.name)}`,
          public_id: `placeholder-${Date.now()}-${index}`,
        }))
      }
    }

    // Generate order number
    const orderNumber = generateOrderNumber()
    console.log('Generated order number:', orderNumber)

    // Create order in database
    try {
      const order = await prisma.order.create({
        data: {
          orderNumber,
          userId: session?.userId, // Associate with logged-in user if available
          customerName: validatedData.customerName,
          customerEmail: validatedData.customerEmail,
          customerPhone: validatedData.customerPhone,
          style: validatedData.style,
          size: validatedData.size,
          numberOfFaces: validatedData.numberOfFaces,
          specialNotes: validatedData.specialNotes,
          basePrice,
          discountAmount,
          finalPrice,
          offerId,
          couponCode: validatedData.couponCode,
          images: {
            create: uploadedImages.map((upload) => ({
              imageUrl: upload.secure_url,
              publicId: upload.public_id,
            }))
          }
        }
      })

      console.log('Order created successfully:', order.id)

      return {
        success: true,
        orderId: order.id,
        orderNumber: order.orderNumber,
      }
    } catch (dbError) {
      console.error('Database error:', dbError)
      return {
        success: false,
        error: 'Failed to save order to database. Please try again.',
      }
    }
  } catch (error) {
    console.error('Order creation error:', error)
    return {
      success: false,
      error: `Failed to create order: ${error instanceof Error ? error.message : 'Unknown error'}`,
    }
  }
}

export async function getOrderForWhatsApp(orderId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId }
    })

    if (!order) {
      throw new Error('Order not found')
    }

    // Get admin settings for WhatsApp number
    const settings = await prisma.adminSettings.findFirst()
    const whatsappNumber = settings?.whatsappNumber || '1234567890'

    // Generate WhatsApp URL
    const whatsappUrl = generateWhatsAppUrl(whatsappNumber, {
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      style: order.style,
      size: order.size,
      numberOfFaces: order.numberOfFaces,
      finalPrice: order.finalPrice,
    })

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
      error: 'Failed to generate WhatsApp link',
    }
  }
}