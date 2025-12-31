#!/usr/bin/env tsx

/**
 * Post-deployment setup script
 * This should be run after deployment to set up the database
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    console.log('🔄 Running post-deployment setup...')
    
    // Push database schema
    console.log('📊 Setting up database schema...')
    // Note: prisma db push should be run via CLI, not programmatically
    
    // Check if database needs seeding
    const userCount = await prisma.user.count()
    const galleryCount = await prisma.galleryImage.count()
    const pricingCount = await prisma.pricing.count()
    
    console.log(`📈 Current database state:`)
    console.log(`  - Users: ${userCount}`)
    console.log(`  - Gallery images: ${galleryCount}`)
    console.log(`  - Pricing entries: ${pricingCount}`)
    
    if (userCount === 0 || galleryCount === 0 || pricingCount === 0) {
      console.log('🌱 Database appears to need seeding')
      console.log('💡 Run: npm run db:seed')
    } else {
      console.log('✅ Database appears to be properly seeded')
    }
    
    console.log('✅ Post-deployment setup completed')
  } catch (error) {
    console.error('❌ Post-deployment setup failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()