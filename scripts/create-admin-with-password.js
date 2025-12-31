const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createAdminWithPassword() {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash('admin123', 12)
    
    // Create admin user
    const user = await prisma.user.upsert({
      where: { email: 'admin@test.com' },
      update: {
        password: hashedPassword,
        role: 'ADMIN',
      },
      create: {
        email: 'admin@test.com',
        name: 'Admin User',
        password: hashedPassword,
        role: 'ADMIN',
        emailVerified: new Date(),
      }
    })
    
    console.log('✅ Admin user created/updated successfully!')
    console.log('📧 Email: admin@test.com')
    console.log('🔑 Password: admin123')
    console.log('👤 Role: ADMIN')
    console.log('🆔 User ID:', user.id)
    console.log('\nYou can now sign in at: http://localhost:3001/auth/signin')
  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

createAdminWithPassword()