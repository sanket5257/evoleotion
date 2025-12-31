#!/usr/bin/env tsx

/**
 * Custom build script that handles environment variables gracefully
 */

import { execSync } from 'child_process'

async function main() {
  try {
    console.log('🔄 Starting build process...')
    
    // Check if DATABASE_URL is available
    const databaseUrl = process.env.DATABASE_URL
    
    if (!databaseUrl) {
      console.log('⚠️  DATABASE_URL not found, using placeholder for build')
      process.env.DATABASE_URL = 'postgresql://placeholder:placeholder@localhost:5432/placeholder'
    }
    
    // Generate Prisma client
    console.log('📊 Generating Prisma client...')
    execSync('prisma generate', { stdio: 'inherit' })
    
    // Build Next.js app
    console.log('🏗️  Building Next.js application...')
    execSync('next build', { stdio: 'inherit' })
    
    console.log('✅ Build completed successfully')
  } catch (error) {
    console.error('❌ Build failed:', error)
    process.exit(1)
  }
}

main()