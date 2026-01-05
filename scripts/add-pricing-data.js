const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function addPricingData() {
  try {
    console.log('Adding pricing data...')

    // Define the pricing structure from the image
    const pricingData = [
      // Pencil Portrait pricing
      { style: 'Pencil Portrait', size: 'A5 (5.8×8.3 IN)', numberOfFaces: 1, basePrice: 600 },
      { style: 'Pencil Portrait', size: 'A4 (8.3×11.7 IN)', numberOfFaces: 1, basePrice: 1500 },
      { style: 'Pencil Portrait', size: 'A3 (11.7×16.5 IN)', numberOfFaces: 1, basePrice: 2200 },
      { style: 'Pencil Portrait', size: 'A2 (16.5×23.4 IN)', numberOfFaces: 1, basePrice: 3500 },

      // Multiple faces pricing (20% increase per additional face)
      { style: 'Pencil Portrait', size: 'A5 (5.8×8.3 IN)', numberOfFaces: 2, basePrice: 720 },
      { style: 'Pencil Portrait', size: 'A4 (8.3×11.7 IN)', numberOfFaces: 2, basePrice: 1800 },
      { style: 'Pencil Portrait', size: 'A3 (11.7×16.5 IN)', numberOfFaces: 2, basePrice: 2640 },
      { style: 'Pencil Portrait', size: 'A2 (16.5×23.4 IN)', numberOfFaces: 2, basePrice: 4200 },

      { style: 'Pencil Portrait', size: 'A5 (5.8×8.3 IN)', numberOfFaces: 3, basePrice: 840 },
      { style: 'Pencil Portrait', size: 'A4 (8.3×11.7 IN)', numberOfFaces: 3, basePrice: 2100 },
      { style: 'Pencil Portrait', size: 'A3 (11.7×16.5 IN)', numberOfFaces: 3, basePrice: 3080 },
      { style: 'Pencil Portrait', size: 'A2 (16.5×23.4 IN)', numberOfFaces: 3, basePrice: 4900 },

      // Charcoal Portrait pricing (25% higher than pencil)
      { style: 'Charcoal Portrait', size: 'A5 (5.8×8.3 IN)', numberOfFaces: 1, basePrice: 750 },
      { style: 'Charcoal Portrait', size: 'A4 (8.3×11.7 IN)', numberOfFaces: 1, basePrice: 1875 },
      { style: 'Charcoal Portrait', size: 'A3 (11.7×16.5 IN)', numberOfFaces: 1, basePrice: 2750 },
      { style: 'Charcoal Portrait', size: 'A2 (16.5×23.4 IN)', numberOfFaces: 1, basePrice: 4375 },

      { style: 'Charcoal Portrait', size: 'A5 (5.8×8.3 IN)', numberOfFaces: 2, basePrice: 900 },
      { style: 'Charcoal Portrait', size: 'A4 (8.3×11.7 IN)', numberOfFaces: 2, basePrice: 2250 },
      { style: 'Charcoal Portrait', size: 'A3 (11.7×16.5 IN)', numberOfFaces: 2, basePrice: 3300 },
      { style: 'Charcoal Portrait', size: 'A2 (16.5×23.4 IN)', numberOfFaces: 2, basePrice: 5250 },

      { style: 'Charcoal Portrait', size: 'A5 (5.8×8.3 IN)', numberOfFaces: 3, basePrice: 1050 },
      { style: 'Charcoal Portrait', size: 'A4 (8.3×11.7 IN)', numberOfFaces: 3, basePrice: 2625 },
      { style: 'Charcoal Portrait', size: 'A3 (11.7×16.5 IN)', numberOfFaces: 3, basePrice: 3850 },
      { style: 'Charcoal Portrait', size: 'A2 (16.5×23.4 IN)', numberOfFaces: 3, basePrice: 6125 },

      // Watercolor Portrait pricing (30% higher than pencil)
      { style: 'Watercolor Portrait', size: 'A5 (5.8×8.3 IN)', numberOfFaces: 1, basePrice: 780 },
      { style: 'Watercolor Portrait', size: 'A4 (8.3×11.7 IN)', numberOfFaces: 1, basePrice: 1950 },
      { style: 'Watercolor Portrait', size: 'A3 (11.7×16.5 IN)', numberOfFaces: 1, basePrice: 2860 },
      { style: 'Watercolor Portrait', size: 'A2 (16.5×23.4 IN)', numberOfFaces: 1, basePrice: 4550 },

      { style: 'Watercolor Portrait', size: 'A5 (5.8×8.3 IN)', numberOfFaces: 2, basePrice: 936 },
      { style: 'Watercolor Portrait', size: 'A4 (8.3×11.7 IN)', numberOfFaces: 2, basePrice: 2340 },
      { style: 'Watercolor Portrait', size: 'A3 (11.7×16.5 IN)', numberOfFaces: 2, basePrice: 3432 },
      { style: 'Watercolor Portrait', size: 'A2 (16.5×23.4 IN)', numberOfFaces: 2, basePrice: 5460 },

      { style: 'Watercolor Portrait', size: 'A5 (5.8×8.3 IN)', numberOfFaces: 3, basePrice: 1092 },
      { style: 'Watercolor Portrait', size: 'A4 (8.3×11.7 IN)', numberOfFaces: 3, basePrice: 2730 },
      { style: 'Watercolor Portrait', size: 'A3 (11.7×16.5 IN)', numberOfFaces: 3, basePrice: 4004 },
      { style: 'Watercolor Portrait', size: 'A2 (16.5×23.4 IN)', numberOfFaces: 3, basePrice: 6370 },
    ]

    // Clear existing pricing data
    console.log('Clearing existing pricing data...')
    await prisma.pricing.deleteMany({})

    // Add new pricing data
    console.log('Adding new pricing data...')
    for (const pricing of pricingData) {
      await prisma.pricing.create({
        data: pricing
      })
      console.log(`Added: ${pricing.style} - ${pricing.size} - ${pricing.numberOfFaces} face(s) - ₹${pricing.basePrice}`)
    }

    console.log('✅ Pricing data added successfully!')
    
  } catch (error) {
    console.error('❌ Error adding pricing data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

addPricingData()