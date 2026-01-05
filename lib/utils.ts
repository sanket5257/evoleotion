import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateOrderNumber(): string {
  try {
    const timestamp = Date.now().toString(36)
    const random = Math.random().toString(36).substr(2, 5)
    return `ORD-${timestamp}-${random}`.toUpperCase()
  } catch (error) {
    // Fallback order number generation
    const fallbackId = Math.random().toString(36).substr(2, 9)
    return `ORD-${fallbackId}`.toUpperCase()
  }
}

export function formatPrice(price: number | null | undefined): string {
  try {
    const validPrice = typeof price === 'number' && !isNaN(price) ? price : 0
    
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(Math.max(0, validPrice))
  } catch (error) {
    // Fallback formatting
    const validPrice = typeof price === 'number' && !isNaN(price) ? price : 0
    return `₹${Math.max(0, validPrice).toLocaleString()}`
  }
}

export function calculateDiscount(
  basePrice: number,
  offer: {
    type?: string
    value?: number
    maxDiscount?: number | null
  } | null | undefined
): number {
  try {
    if (!offer || typeof basePrice !== 'number' || isNaN(basePrice) || basePrice <= 0) {
      return 0
    }

    const { type, value, maxDiscount } = offer
    
    if (typeof value !== 'number' || isNaN(value) || value <= 0) {
      return 0
    }

    let discount = 0

    switch (type) {
      case 'FLAT_DISCOUNT':
        discount = Math.min(value, basePrice)
        break
      case 'PERCENTAGE_DISCOUNT':
      case 'FIRST_ORDER_DISCOUNT':
        const percentageDiscount = (basePrice * value) / 100
        discount = typeof maxDiscount === 'number' && maxDiscount > 0
          ? Math.min(percentageDiscount, maxDiscount)
          : percentageDiscount
        break
      default:
        discount = 0
    }

    // Ensure discount is not negative and doesn't exceed base price
    return Math.max(0, Math.min(discount, basePrice))
  } catch (error) {
    console.warn('Error calculating discount:', error)
    return 0
  }
}

export function generateWhatsAppUrl(
  phoneNumber: string | null | undefined,
  orderDetails: {
    orderNumber?: string
    customerName?: string
    style?: string
    size?: string
    numberOfFaces?: number
    finalPrice?: number
  } | null | undefined
): string {
  try {
    // Validate inputs with fallbacks
    const validPhoneNumber = typeof phoneNumber === 'string' && phoneNumber.trim() 
      ? phoneNumber.replace(/[^\d]/g, '') 
      : '1234567890'
    
    const details = orderDetails || {}
    const {
      orderNumber = 'N/A',
      customerName = 'Customer',
      style = 'Portrait',
      size = 'Standard',
      numberOfFaces = 1,
      finalPrice = 0
    } = details

    const message = `Hi! I've placed an order on your portrait website.

Order Details:
📋 Order ID: ${orderNumber}
👤 Name: ${customerName}
🎨 Style: ${style}
📏 Size: ${size}
👥 Number of Faces: ${numberOfFaces}
💰 Total Amount: ${formatPrice(finalPrice)}

Please share payment instructions. Thank you!`

    const encodedMessage = encodeURIComponent(message)
    return `https://wa.me/${validPhoneNumber}?text=${encodedMessage}`
  } catch (error) {
    console.error('WhatsApp URL generation error:', error)
    
    // Fallback URL
    const fallbackPhone = '1234567890'
    const fallbackMessage = encodeURIComponent(
      `Hi! I've placed an order on your portrait website. Please share payment instructions.`
    )
    return `https://wa.me/${fallbackPhone}?text=${fallbackMessage}`
  }
}