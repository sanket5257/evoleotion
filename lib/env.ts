// Environment variable validation and fallbacks for production safety

export const env = {
  // Database
  DATABASE_URL: process.env.DATABASE_URL || '',
  
  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'fallback-secret-change-in-production',
  
  // Email
  EMAIL_SERVER_HOST: process.env.EMAIL_SERVER_HOST || '',
  EMAIL_SERVER_PORT: process.env.EMAIL_SERVER_PORT || '587',
  EMAIL_SERVER_USER: process.env.EMAIL_SERVER_USER || '',
  EMAIL_SERVER_PASSWORD: process.env.EMAIL_SERVER_PASSWORD || '',
  EMAIL_FROM: process.env.EMAIL_FROM || 'noreply@example.com',
  
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  
  // App
  NODE_ENV: process.env.NODE_ENV || 'development',
  VERCEL_URL: process.env.VERCEL_URL || '',
  
  // Validation
  get isProduction() {
    return this.NODE_ENV === 'production'
  },
  
  get isDevelopment() {
    return this.NODE_ENV === 'development'
  },
  
  validate() {
    const required = [
      'DATABASE_URL',
      'JWT_SECRET',
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      'SUPABASE_SERVICE_ROLE_KEY'
    ]
    
    const missing = required.filter(key => !env[key as keyof typeof env])
    
    if (missing.length > 0 && env.isProduction) {
      console.error('Missing required environment variables:', missing)
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
    }
    
    if (missing.length > 0 && env.isDevelopment) {
      console.warn('Missing environment variables (development):', missing)
    }
    
    return true
  }
}

// Validate on import
try {
  env.validate()
} catch (error) {
  console.error('Environment validation failed:', error)
}