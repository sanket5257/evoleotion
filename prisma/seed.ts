const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@portraitstudio.com' },
    update: {},
    create: {
      email: 'admin@portraitstudio.com',
      name: 'Admin User',
      role: 'ADMIN',
    },
  })

  console.log('👤 Created admin user:', adminUser.email)

  // Create sample gallery images
  const galleryImages = [
    {
      title: 'Watercolor Portrait',
      description: 'Beautiful watercolor style portrait with soft, flowing colors',
      imageUrl: '/api/placeholder/400/500',
      publicId: 'sample-watercolor-1',
      style: 'Watercolor',
      tags: ['portrait', 'watercolor', 'artistic'],
      isActive: true,
      order: 1,
    },
    {
      title: 'Oil Painting Style',
      description: 'Classic oil painting technique with rich textures',
      imageUrl: '/api/placeholder/400/500',
      publicId: 'sample-oil-1',
      style: 'Oil Painting',
      tags: ['portrait', 'oil', 'classic'],
      isActive: true,
      order: 2,
    },
    {
      title: 'Pencil Sketch',
      description: 'Detailed pencil sketch with realistic shading',
      imageUrl: '/api/placeholder/400/500',
      publicId: 'sample-pencil-1',
      style: 'Pencil Sketch',
      tags: ['portrait', 'pencil', 'sketch'],
      isActive: true,
      order: 3,
    },
    {
      title: 'Digital Art',
      description: 'Modern digital art style with vibrant colors',
      imageUrl: '/api/placeholder/400/500',
      publicId: 'sample-digital-1',
      style: 'Digital Art',
      tags: ['portrait', 'digital', 'modern'],
      isActive: true,
      order: 4,
    },
  ]

  for (const image of galleryImages) {
    await prisma.galleryImage.create({
      data: image,
    })
  }

  console.log('🖼️ Created gallery images')

  // Create pricing rules
  const styles = ['Watercolor', 'Oil Painting', 'Pencil Sketch', 'Digital Art']
  const sizes = ['8x10', '11x14', '16x20', '18x24']
  const faces = [1, 2, 3, 4, 5]

  const basePrices = {
    '8x10': { 1: 1999, 2: 2999, 3: 3999, 4: 4999, 5: 5999 },
    '11x14': { 1: 2999, 2: 3999, 3: 4999, 4: 5999, 5: 6999 },
    '16x20': { 1: 3999, 2: 4999, 3: 5999, 4: 6999, 5: 7999 },
    '18x24': { 1: 4999, 2: 5999, 3: 6999, 4: 7999, 5: 8999 },
  }

  for (const style of styles) {
    for (const size of sizes) {
      for (const faceCount of faces) {
        await prisma.pricing.upsert({
          where: {
            style_size_numberOfFaces: {
              style,
              size,
              numberOfFaces: faceCount,
            },
          },
          update: {},
          create: {
            style,
            size,
            numberOfFaces: faceCount,
            basePrice: basePrices[size as keyof typeof basePrices][faceCount as keyof typeof basePrices['8x10']],
            isActive: true,
          },
        })
      }
    }
  }

  console.log('💰 Created pricing rules')

  // Create sample offers
  const offers = [
    {
      title: 'New Year Special',
      description: '20% off all portraits - Limited time offer!',
      type: 'PERCENTAGE_DISCOUNT',
      value: 20,
      maxDiscount: 2000,
      isActive: true,
      priority: 10,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      applicableStyles: [],
      firstOrderOnly: false,
    },
    {
      title: 'First Order Discount',
      description: 'Get 15% off your first portrait order',
      type: 'FIRST_ORDER_DISCOUNT',
      value: 15,
      maxDiscount: 1500,
      isActive: true,
      priority: 5,
      applicableStyles: [],
      firstOrderOnly: true,
    },
    {
      title: 'SAVE500',
      description: 'Flat ₹500 off on orders above ₹3000',
      type: 'FLAT_DISCOUNT',
      value: 500,
      couponCode: 'SAVE500',
      isActive: true,
      priority: 8,
      minOrderValue: 3000,
      applicableStyles: [],
      firstOrderOnly: false,
    },
  ]

  for (const offer of offers) {
    await prisma.offer.create({
      data: offer,
    })
  }

  console.log('🎁 Created sample offers')

  // Create admin settings
  await prisma.adminSettings.create({
    data: {
      whatsappNumber: '919876543210', // Replace with actual WhatsApp number
      bannerTitle: 'Limited Time Offer!',
      bannerText: 'Get 20% off on all portrait orders. Use code SAVE20',
      bannerActive: true,
    },
  })

  console.log('⚙️ Created admin settings')

  console.log('✅ Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })