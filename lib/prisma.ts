import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Enhanced Prisma configuration for serverless environments
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  },
  // Configure connection pool for serverless
  __internal: {
    engine: {
      // Reduce connection timeout for faster failures
      connectTimeout: 10000,
      // Pool configuration for serverless
      pool: {
        timeout: 10000,
        idleTimeout: 30000,
      }
    }
  }
})

// Ensure single instance in development
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Graceful shutdown handling
process.on('beforeExit', async () => {
  await prisma.$disconnect()
})