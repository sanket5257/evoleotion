const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function createTestAdmin() {
  try {
    // Create a test admin user
    const user = await prisma.user.create({
      data: {
        email: 'test@admin.com',
        name: 'Test Admin',
        role: 'ADMIN',
        emailVerified: new Date(), // Mark as verified
      }
    })
    
    console.log('✅ Test admin user created!')
    console.log('Email: test@admin.com')
    console.log('You can now sign in with this email')
    console.log('User ID:', user.id)
  } catch (error) {
    if (error.code === 'P2002') {
      console.log('❌ User with email test@admin.com already exists')
    } else {
      console.error('❌ Error:', error.message)
    }
  } finally {
    await prisma.$disconnect()
  }
}

createTestAdmin()