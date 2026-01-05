// Supabase client configuration and utilities
// This file replaces lib/prisma.ts to provide Supabase database access

import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

// Environment validation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
}

if (!supabaseServiceKey) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable')
}

// Global instance management for serverless environments
const globalForSupabase = globalThis as unknown as {
  supabase: ReturnType<typeof createClient<Database>> | undefined
}

// Enhanced Supabase configuration for serverless environments
export const supabase = globalForSupabase.supabase ?? createClient<Database>(
  supabaseUrl,
  supabaseServiceKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    },
    db: {
      schema: 'public'
    },
    global: {
      headers: {
        'x-application-name': 'portrait-studio'
      }
    }
  }
)

// Ensure single instance in development
if (process.env.NODE_ENV !== 'production') {
  globalForSupabase.supabase = supabase
}

// Export as 'prisma' for backward compatibility with existing code
export const prisma = supabase

// Connection health check
export async function checkConnection(): Promise<boolean> {
  try {
    const { error } = await supabase.from('users').select('id').limit(1)
    return !error
  } catch (error) {
    console.error('Supabase connection check failed:', error)
    return false
  }
}

// Graceful shutdown handling (Supabase doesn't need explicit disconnection)
if (typeof process !== 'undefined') {
  process.on('beforeExit', async () => {
    console.log('Supabase client cleanup completed')
  })
}

// Re-export database utilities for convenience
export * from './supabase-db'

// Default export for compatibility
export default supabase