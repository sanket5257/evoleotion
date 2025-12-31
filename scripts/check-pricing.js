const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkPricing() {
  try {
    console.log('🔍 Checking pricing data...')
    
    const pricing = await prisma.pricing.findMany({
      where: { isActive: true },
      orderBy: [
        { style: 'asc' },
        { numberOfFaces: 'asc' },
        { size: 'asc' }
      ]
    })
    
    console.log(`Found ${pricing.length} pricing entries`)
    
    // Group by style
    const byStyle = pricing.reduce((acc, p) => {
      if (!acc[p.style]) acc[p.style] = []
      acc[p.style].push(p)
      return acc
    }, {})
    
    console.log('\n📊 Pricing by style:')
    Object.keys(byStyle).forEach(style => {
      console.log(`  ${style}: ${byStyle[style].length} entries`)
      
      // Show sample entries
      const sample = byStyle[style].slice(0, 3)
      sample.forEach(p => {
        console.log(`    - ${p.size}, ${p.numberOfFaces} faces: ₹${p.basePrice}`)
      })
    })
    
    // Check offers
    const offers = await prisma.offer.findMany({
      where: { isActive: true }
    })
    
    console.log(`\n🎁 Found ${offers.length} active offers`)
    offers.forEach(offer => {
      console.log(`  - ${offer.title}: ${offer.type} ${offer.value}${offer.type.includes('PERCENTAGE') ? '%' : ''}`)
    })
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkPricing()