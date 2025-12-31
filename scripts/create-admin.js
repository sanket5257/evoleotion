const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function createAdmin() {
  const email = process.argv[2]
  
  if (!email) {
    console.log('Usage: node scripts/create-admin.js <email>')
    console.log('Example: node scripts/create-admin.js admin@example.com')
    process.exit(1)
  }

  try {
    const user = await prisma.user.update({
      where: { email },
      data: { role: 'ADMIN' }
    })
    
    console.log(`✅ Successfully made ${email} an admin!`)
    console.log(`User ID: ${user.id}`)
  } catch (error) {
    if (error.code === 'P2025') {
      console.log(`❌ User with email ${email} not found.`)
      console.log('Please sign up first, then run this script.')
    } else {
      console.error('❌ Error:', error.message)
    }
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()