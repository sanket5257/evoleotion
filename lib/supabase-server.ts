import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Server-side Supabase client with service role key
export const supabaseServer = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Helper functions for common operations
export async function getUserByEmail(email: string) {
  const { data, error } = await supabaseServer
    .from('users')
    .select('*')
    .eq('email', email.toLowerCase())
    .single()
  
  if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
    throw error
  }
  
  return data
}

export async function createUser(userData: {
  name: string
  email: string
  password: string
  role?: string
}) {
  const { data, error } = await supabaseServer
    .from('users')
    .insert({
      name: userData.name.trim(),
      email: userData.email.toLowerCase(),
      password: userData.password,
      role: userData.role || 'USER'
    })
    .select()
    .single()
  
  if (error) {
    throw error
  }
  
  return data
}

export async function getUserCount() {
  const { count, error } = await supabaseServer
    .from('users')
    .select('*', { count: 'exact', head: true })
  
  if (error) {
    throw error
  }
  
  return count || 0
}