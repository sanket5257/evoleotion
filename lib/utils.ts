import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substr(2, 5)
  return `ORD-${timestamp}-${random}`.toUpperCase()
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(price)
}

export function calculateDiscount(
  basePrice: number,
  offer: {
    type: string
    value: number
    maxDiscount?: number | null
  }
): number {
  switch (offer.type) {
    case 'FLAT_DISCOUNT':
      return Math.min(offer.value, basePrice)
    case 'PERCENTAGE_DISCOUNT':
      const percentageDiscount = (basePrice * offer.value) / 100
      return offer.maxDiscount
        ? Math.min(percentageDiscount, offer.maxDiscount)
        : percentageDiscount
    case 'FIRST_ORDER_DISCOUNT':
      const firstOrderDiscount = (basePrice * offer.value) / 100
      return offer.maxDiscount
        ? Math.min(firstOrderDiscount, offer.maxDiscount)
        : firstOrderDiscount
    default:
      return 0
  }
}

export function generateWhatsAppUrl(
  phoneNumber: string,
  orderDetails: {
    orderNumber: string
    customerName: string
    style: string
    size: string
    numberOfFaces: number
    finalPrice: number
  }
): string {
  const message = `Hi! I've placed an order on your portrait website.

Order Details:
📋 Order ID: ${orderDetails.orderNumber}
� Namer: ${orderDetails.customerName}
🎨 Style: ${orderDetails.style}
📏 Size: ${orderDetails.size}
� SNumber of Faces: ${orderDetails.numberOfFaces}
� Totael Amount: ${formatPrice(orderDetails.finalPrice)}

Please share payment instructions. Thank you!`

  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
}