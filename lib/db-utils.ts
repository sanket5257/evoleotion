import { supabaseServer } from './supabase-server'

// Database connection utility with retry logic
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
      
      // Don't retry on validation errors or user errors
      if (error instanceof Error) {
        if (error.message.includes('duplicate key') || 
            error.message.includes('Invalid') ||
            error.message.includes('required') ||
            error.message.includes('violates')) {
          throw error
        }
      }

      console.warn(`Database operation failed (attempt ${attempt}/${maxRetries}):`, error)
      
      if (attempt === maxRetries) {
        break
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * attempt))
    }
  }
  
  throw lastError!
}

// Test database connection
export async function testConnection(): Promise<boolean> {
  try {
    // Check if database connection is available
    if (!supabaseServer) {
      console.error('Database connection not available')
      return false
    }

    const { data, error } = await supabaseServer
      .from('users')
      .select('id')
      .limit(1)
    
    if (error) {
      throw error
    }
    
    return true
  } catch (error) {
    console.error('Database connection test failed:', error)
    return false
  }
}

// Ensure database connection is ready
export async function ensureConnection(): Promise<void> {
  const isConnected = await testConnection()
  if (!isConnected) {
    throw new Error('Database connection failed')
  }
}