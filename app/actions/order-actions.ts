'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { uploadToCloudinary } from '@/lib/cloudinary'
import { generateOrderNumber, generateWhatsAppUrl } from '@/lib/utils'
import { orderSchema } from '@/lib/validations'
import { redirect } from 'next/navigation'

export async function createOrder(formData: FormData) {
  try {
    // Get current session to associate order with user
    const session = await getServerSession(authOptions)
    
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

    // Validate form data
    const validatedData = orderSchema.parse(data)

    // Extract price data
    const basePrice = parseFloat(formData.get('basePrice') as string)
    const discountAmount = parseFloat(formData.get('discountAmount') as string)
    const finalPrice = parseFloat(formData.get('finalPrice') as string)
    const offerId = formData.get('offerId') as string || undefined

    // Upload images to Cloudinary
    const imageUploads = []
    let imageIndex = 0
    
    while (formData.get(`image-${imageIndex}`)) {
      const file = formData.get(`image-${imageIndex}`) as File
      if (file && file.size > 0) {
        imageUploads.push(uploadToCloudinary(file, 'orders'))
      }
      imageIndex++
    }

    const uploadedImages = await Promise.all(imageUploads)

    // Generate order number
    const orderNumber = generateOrderNumber()

    // Create order in database
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: session?.user?.id, // Associate with logged-in user if available
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
          create: uploadedImages.map((upload: any) => ({
            imageUrl: upload.secure_url,
            publicId: upload.public_id,
          }))
        }
      }
    })

    return {
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
    }
  } catch (error) {
    console.error('Order creation error:', error)
    return {
      success: false,
      error: 'Failed to create order. Please try again.',
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