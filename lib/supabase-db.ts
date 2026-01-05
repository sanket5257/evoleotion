// Supabase database utilities and common operations
import { supabaseAdmin } from './supabase'
import type { Database } from '@/types/supabase'
import type { 
  User, UserInsert, UserUpdate,
  GalleryImage, GalleryImageInsert, GalleryImageUpdate,
  Pricing, PricingInsert, PricingUpdate,
  Offer, OfferInsert, OfferUpdate,
  Order, OrderInsert, OrderUpdate,
  OrderImage, OrderImageInsert, OrderImageUpdate,
  UserFavorite, UserFavoriteInsert, UserFavoriteUpdate,
  AdminSettings, AdminSettingsInsert, AdminSettingsUpdate
} from '@/types/supabase'

// Error handling utility
export class DatabaseError extends Error {
  constructor(message: string, public originalError?: any) {
    super(message)
    this.name = 'DatabaseError'
  }
}

// Connection management and health check
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin.from('users').select('id').limit(1)
    return !error
  } catch (error) {
    console.error('Database connection check failed:', error)
    return false
  }
}

// Retry mechanism for database operations
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error as Error
      
      if (attempt === maxRetries) {
        throw new DatabaseError(`Operation failed after ${maxRetries} attempts`, lastError)
      }
      
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt - 1)))
    }
  }
  
  throw lastError!
}

// Generic CRUD operations with simplified typing
export class SupabaseRepository<T = any, TInsert = any, TUpdate = any> {
  constructor(private tableName: string) {}

  async findMany(options?: {
    where?: Record<string, any>
    orderBy?: { column: string; ascending?: boolean }
    limit?: number
    offset?: number
  }): Promise<T[]> {
    return withRetry(async () => {
      let query = supabaseAdmin.from(this.tableName).select('*')
      
      if (options?.where) {
        Object.entries(options.where).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            query = query.eq(key, value)
          }
        })
      }
      
      if (options?.orderBy) {
        query = query.order(options.orderBy.column, { 
          ascending: options.orderBy.ascending ?? true 
        })
      }
      
      if (options?.limit) {
        query = query.limit(options.limit)
      }
      
      if (options?.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
      }
      
      const { data, error } = await query
      
      if (error) {
        throw new DatabaseError(`Failed to fetch ${this.tableName}`, error)
      }
      
      return data as T[]
    })
  }

  async findById(id: string): Promise<T | null> {
    return withRetry(async () => {
      const { data, error } = await supabaseAdmin
        .from(this.tableName)
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) {
        if (error.code === 'PGRST116') return null // Not found
        throw new DatabaseError(`Failed to fetch ${this.tableName} by id`, error)
      }
      
      return data as T
    })
  }

  async create(data: TInsert): Promise<T> {
    return withRetry(async () => {
      const { data: result, error } = await supabaseAdmin
        .from(this.tableName)
        .insert(data as any)
        .select()
        .single()
      
      if (error) {
        throw new DatabaseError(`Failed to create ${this.tableName}`, error)
      }
      
      return result as T
    })
  }

  async update(id: string, data: TUpdate): Promise<T> {
    return withRetry(async () => {
      const { data: result, error } = await (supabaseAdmin as any)
        .from(this.tableName)
        .update(data)
        .eq('id', id)
        .select()
        .single()
      
      if (error) {
        throw new DatabaseError(`Failed to update ${this.tableName}`, error)
      }
      
      return result as T
    })
  }

  async delete(id: string): Promise<void> {
    return withRetry(async () => {
      const { error } = await supabaseAdmin
        .from(this.tableName)
        .delete()
        .eq('id', id)
      
      if (error) {
        throw new DatabaseError(`Failed to delete ${this.tableName}`, error)
      }
    })
  }

  async count(where?: Record<string, any>): Promise<number> {
    return withRetry(async () => {
      let query = supabaseAdmin.from(this.tableName).select('*', { count: 'exact', head: true })
      
      if (where) {
        Object.entries(where).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            query = query.eq(key, value)
          }
        })
      }
      
      const { count, error } = await query
      
      if (error) {
        throw new DatabaseError(`Failed to count ${this.tableName}`, error)
      }
      
      return count || 0
    })
  }

  async upsert(data: TInsert, onConflict?: string): Promise<T> {
    return withRetry(async () => {
      const { data: result, error } = await supabaseAdmin
        .from(this.tableName)
        .upsert(data as any, { onConflict })
        .select()
        .single()
      
      if (error) {
        throw new DatabaseError(`Failed to upsert ${this.tableName}`, error)
      }
      
      return result as T
    })
  }
}

// Repository instances for each table
export const usersRepository = new SupabaseRepository<User, UserInsert, UserUpdate>('users')
export const galleryImagesRepository = new SupabaseRepository<GalleryImage, GalleryImageInsert, GalleryImageUpdate>('gallery_images')
export const pricingRepository = new SupabaseRepository<Pricing, PricingInsert, PricingUpdate>('pricing')
export const offersRepository = new SupabaseRepository<Offer, OfferInsert, OfferUpdate>('offers')
export const ordersRepository = new SupabaseRepository<Order, OrderInsert, OrderUpdate>('orders')
export const orderImagesRepository = new SupabaseRepository<OrderImage, OrderImageInsert, OrderImageUpdate>('order_images')
export const userFavoritesRepository = new SupabaseRepository<UserFavorite, UserFavoriteInsert, UserFavoriteUpdate>('user_favorites')
export const adminSettingsRepository = new SupabaseRepository<AdminSettings, AdminSettingsInsert, AdminSettingsUpdate>('admin_settings')

// Specialized database operations

// User operations
export async function getUserByEmail(email: string): Promise<User | null> {
  return withRetry(async () => {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') return null // Not found
      throw new DatabaseError('Failed to fetch user by email', error)
    }
    
    return data as User
  })
}

export async function createUser(userData: {
  name: string
  email: string
  password?: string
  role?: 'USER' | 'ADMIN'
}): Promise<User> {
  return usersRepository.create({
    name: userData.name.trim(),
    email: userData.email.toLowerCase(),
    password: userData.password,
    role: userData.role || 'USER'
  })
}

// Gallery operations
export async function getActiveGalleryImages(options?: {
  style?: string
  limit?: number
  offset?: number
}): Promise<GalleryImage[]> {
  return galleryImagesRepository.findMany({
    where: { 
      is_active: true,
      ...(options?.style && { style: options.style })
    },
    orderBy: { column: 'order_index', ascending: true },
    limit: options?.limit,
    offset: options?.offset
  })
}

export async function toggleGalleryImageStatus(id: string): Promise<GalleryImage> {
  const image = await galleryImagesRepository.findById(id)
  if (!image) {
    throw new DatabaseError('Gallery image not found')
  }
  
  return galleryImagesRepository.update(id, { is_active: !image.is_active })
}

// Pricing operations
export async function getActivePricing(): Promise<Pricing[]> {
  return pricingRepository.findMany({
    where: { is_active: true },
    orderBy: { column: 'style', ascending: true }
  })
}

export async function getPricingByDetails(
  style: string, 
  size: string, 
  numberOfFaces: number
): Promise<Pricing | null> {
  return withRetry(async () => {
    const { data, error } = await supabaseAdmin
      .from('pricing')
      .select('*')
      .eq('style', style)
      .eq('size', size)
      .eq('number_of_faces', numberOfFaces)
      .eq('is_active', true)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') return null // Not found
      throw new DatabaseError('Failed to fetch pricing', error)
    }
    
    return data as Pricing
  })
}

// Offer operations
export async function getActiveOffers(): Promise<Offer[]> {
  return withRetry(async () => {
    const now = new Date().toISOString()
    const { data, error } = await supabaseAdmin
      .from('offers')
      .select('*')
      .eq('is_active', true)
      .or(`start_date.is.null,start_date.lte.${now}`)
      .or(`end_date.is.null,end_date.gte.${now}`)
      .order('priority', { ascending: false })
    
    if (error) {
      throw new DatabaseError('Failed to fetch active offers', error)
    }
    
    return data as Offer[]
  })
}

export async function getOfferByCouponCode(couponCode: string): Promise<Offer | null> {
  return withRetry(async () => {
    const { data, error } = await supabaseAdmin
      .from('offers')
      .select('*')
      .eq('coupon_code', couponCode.toUpperCase())
      .eq('is_active', true)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') return null // Not found
      throw new DatabaseError('Failed to fetch offer by coupon code', error)
    }
    
    return data as Offer
  })
}

// Order operations
export async function generateOrderNumber(): Promise<string> {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `ORD-${timestamp}-${random}`
}

export async function getOrdersByUser(userId: string): Promise<Order[]> {
  return ordersRepository.findMany({
    where: { user_id: userId },
    orderBy: { column: 'created_at', ascending: false }
  })
}

export async function getOrderByNumber(orderNumber: string): Promise<Order | null> {
  return withRetry(async () => {
    const { data, error } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('order_number', orderNumber)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') return null // Not found
      throw new DatabaseError('Failed to fetch order by number', error)
    }
    
    return data as Order
  })
}

// User favorites operations
export async function getUserFavorites(userId: string): Promise<(UserFavorite & { image: GalleryImage })[]> {
  return withRetry(async () => {
    const { data, error } = await supabaseAdmin
      .from('user_favorites')
      .select(`
        *,
        image:gallery_images(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) {
      throw new DatabaseError('Failed to fetch user favorites', error)
    }
    
    return data as (UserFavorite & { image: GalleryImage })[]
  })
}

export async function toggleUserFavorite(userId: string, imageId: string): Promise<{ added: boolean }> {
  return withRetry(async () => {
    // Check if favorite exists
    const { data: existing } = await supabaseAdmin
      .from('user_favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('image_id', imageId)
      .single()
    
    if (existing && (existing as any).id) {
      // Remove favorite
      await userFavoritesRepository.delete((existing as any).id)
      return { added: false }
    } else {
      // Add favorite
      await userFavoritesRepository.create({
        user_id: userId,
        image_id: imageId
      })
      return { added: true }
    }
  })
}

// Admin settings operations
export async function getAdminSettings(): Promise<AdminSettings | null> {
  return withRetry(async () => {
    const { data, error } = await supabaseAdmin
      .from('admin_settings')
      .select('*')
      .limit(1)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') return null // Not found
      throw new DatabaseError('Failed to fetch admin settings', error)
    }
    
    return data as AdminSettings
  })
}

export async function updateAdminSettings(settings: Partial<AdminSettingsUpdate>): Promise<AdminSettings> {
  return withRetry(async () => {
    // Get existing settings or create new ones
    const existing = await getAdminSettings()
    
    if (existing) {
      return adminSettingsRepository.update(existing.id, settings)
    } else {
      return adminSettingsRepository.create({
        whatsapp_number: settings.whatsapp_number || '',
        banner_title: settings.banner_title,
        banner_text: settings.banner_text,
        banner_active: settings.banner_active || false
      })
    }
  })
}

// Transaction support
export async function withTransaction<T>(
  operations: (client: typeof supabaseAdmin) => Promise<T>
): Promise<T> {
  // Note: Supabase doesn't have explicit transactions like Prisma
  // We'll implement a simple retry mechanism for now
  // In production, consider using Supabase Edge Functions for complex transactions
  return withRetry(() => operations(supabaseAdmin))
}

// Batch operations
export async function batchInsert<T extends keyof Database['public']['Tables']>(
  tableName: T,
  data: Database['public']['Tables'][T]['Insert'][],
  batchSize: number = 100
): Promise<any[]> {
  const results: any[] = []
  
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize)
    
    const { data: batchResults, error } = await supabaseAdmin
      .from(tableName)
      .insert(batch as any)
      .select()
    
    if (error) {
      throw new DatabaseError(`Failed to batch insert into ${String(tableName)}`, error)
    }
    
    results.push(...(batchResults as any[]))
  }
  
  return results
}

// Search operations
export async function searchGalleryImages(query: string, options?: {
  style?: string
  limit?: number
}): Promise<GalleryImage[]> {
  return withRetry(async () => {
    let dbQuery = supabaseAdmin
      .from('gallery_images')
      .select('*')
      .eq('is_active', true)
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
    
    if (options?.style) {
      dbQuery = dbQuery.eq('style', options.style)
    }
    
    if (options?.limit) {
      dbQuery = dbQuery.limit(options.limit)
    }
    
    dbQuery = dbQuery.order('order_index', { ascending: true })
    
    const { data, error } = await dbQuery
    
    if (error) {
      throw new DatabaseError('Failed to search gallery images', error)
    }
    
    return data as GalleryImage[]
  })
}

// Analytics and reporting
export async function getOrderStats(dateRange?: { from: string; to: string }): Promise<{
  totalOrders: number
  totalRevenue: number
  averageOrderValue: number
  ordersByStatus: Record<string, number>
}> {
  return withRetry(async () => {
    let query = supabaseAdmin.from('orders').select('*')
    
    if (dateRange) {
      query = query
        .gte('createdAt', dateRange.from)
        .lte('createdAt', dateRange.to)
    }
    
    const { data: orders, error } = await query
    
    if (error) {
      throw new DatabaseError('Failed to fetch order stats', error)
    }
    
    const ordersData = orders as Order[]
    const totalOrders = ordersData.length
    const totalRevenue = ordersData.reduce((sum, order) => sum + order.final_price, 0)
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
    
    const ordersByStatus = ordersData.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    return {
      totalOrders,
      totalRevenue,
      averageOrderValue,
      ordersByStatus
    }
  })
}

// Export the main client for direct access when needed
export { supabaseAdmin as db }

// Graceful shutdown handling
if (typeof process !== 'undefined') {
  process.on('beforeExit', async () => {
    // Supabase client doesn't need explicit disconnection like Prisma
    console.log('Supabase client cleanup completed')
  })
}