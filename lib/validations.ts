import { z } from 'zod'

export const orderSchema = z.object({
  customerName: z.string().min(2, 'Name must be at least 2 characters'),
  customerEmail: z.string().email('Invalid email address'),
  customerPhone: z.string().min(10, 'Phone number must be at least 10 digits'),
  style: z.string().min(1, 'Please select a style'),
  size: z.string().min(1, 'Please select a size'),
  numberOfFaces: z.number().min(1, 'Number of faces must be at least 1'),
  frameId: z.string().optional(),
  specialNotes: z.string().optional(),
  couponCode: z.string().optional(),
})

export const galleryImageSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  style: z.string().min(1, 'Style is required'),
  tags: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
})

export const pricingSchema = z.object({
  style: z.string().min(1, 'Style is required'),
  size: z.string().min(1, 'Size is required'),
  numberOfFaces: z.number().min(1, 'Number of faces must be at least 1'),
  basePrice: z.number().min(0, 'Price must be positive'),
  isActive: z.boolean().default(true),
})

export const frameSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  price: z.number().min(0, 'Price must be positive'),
  isActive: z.boolean().default(true),
})

export const offerSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  type: z.enum(['FLAT_DISCOUNT', 'PERCENTAGE_DISCOUNT', 'FREE_FRAME', 'FIRST_ORDER_DISCOUNT']),
  value: z.number().min(0, 'Value must be positive'),
  maxDiscount: z.number().optional(),
  couponCode: z.string().optional(),
  isActive: z.boolean().default(true),
  priority: z.number().default(0),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  minOrderValue: z.number().optional(),
  applicableStyles: z.array(z.string()).default([]),
  firstOrderOnly: z.boolean().default(false),
})