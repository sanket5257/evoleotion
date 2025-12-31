const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkWhatsAppSettings() {
  try {
    console.log('🔍 Checking WhatsApp settings...')
    
    const settings = await prisma.adminSettings.findFirst()
    
    if (settings) {
      console.log('✅ Admin settings found:')
      console.log('  WhatsApp Number:', settings.whatsappNumber)
      console.log('  Banner Title:', settings.bannerTitle)
      console.log('  Banner Text:', settings.bannerText)
      console.log('  Banner Active:', settings.bannerActive)
      console.log('  Created At:', settings.createdAt)
      console.log('  Updated At:', settings.updatedAt)
    } else {
      console.log('❌ No admin settings found')
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkWhatsAppSettings()