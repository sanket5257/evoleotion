const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function updateWhatsAppNumber() {
  try {
    console.log('🔄 Updating WhatsApp number...')
    
    // First, try to find existing settings
    const existingSettings = await prisma.adminSettings.findFirst()
    
    if (existingSettings) {
      // Update existing settings
      const settings = await prisma.adminSettings.update({
        where: { id: existingSettings.id },
        data: {
          whatsappNumber: '917083259985', // Adding country code for India
        }
      })
      console.log('✅ WhatsApp number updated successfully!')
      console.log('Updated settings ID:', settings.id)
    } else {
      // Create new settings
      const settings = await prisma.adminSettings.create({
        data: {
          whatsappNumber: '917083259985',
          bannerTitle: 'Limited Time Offer!',
          bannerText: 'Get 20% off on all portrait orders. Use code SAVE20',
          bannerActive: true,
        }
      })
      console.log('✅ WhatsApp settings created successfully!')
      console.log('New settings ID:', settings.id)
    }
    
    console.log('New WhatsApp number: +91 7083259985')
    console.log('Orders will now redirect to this WhatsApp number')
    
  } catch (error) {
    console.error('❌ Error updating WhatsApp number:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateWhatsAppNumber()