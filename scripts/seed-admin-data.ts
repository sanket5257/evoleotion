import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding admin data...')

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12)
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@portraitstudio.com' },
    update: {},
    create: {
      email: 'admin@portraitstudio.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  console.log('✅ Admin user created:', adminUser.email)

  // Create sample pricing rules - Only Charcoal and Pencil
  const pricingRules = [
    // Charcoal pricing
    { style: 'Charcoal', size: '8x10', numberOfFaces: 1, basePrice: 2000 },
    { style: 'Charcoal', size: '8x10', numberOfFaces: 2, basePrice: 3000 },
    { style: 'Charcoal', size: '8x10', numberOfFaces: 3, basePrice: 4000 },
    { style: 'Charcoal', size: '11x14', numberOfFaces: 1, basePrice: 3000 },
    { style: 'Charcoal', size: '11x14', numberOfFaces: 2, basePrice: 4000 },
    { style: 'Charcoal', size: '11x14', numberOfFaces: 3, basePrice: 5000 },
    { style: 'Charcoal', size: '16x20', numberOfFaces: 1, basePrice: 4500 },
    { style: 'Charcoal', size: '16x20', numberOfFaces: 2, basePrice: 5500 },
    { style: 'Charcoal', size: '16x20', numberOfFaces: 3, basePrice: 6500 },
    
    // Pencil Sketch pricing
    { style: 'Pencil Sketch', size: '8x10', numberOfFaces: 1, basePrice: 1500 },
    { style: 'Pencil Sketch', size: '8x10', numberOfFaces: 2, basePrice: 2500 },
    { style: 'Pencil Sketch', size: '8x10', numberOfFaces: 3, basePrice: 3500 },
    { style: 'Pencil Sketch', size: '11x14', numberOfFaces: 1, basePrice: 2500 },
    { style: 'Pencil Sketch', size: '11x14', numberOfFaces: 2, basePrice: 3500 },
    { style: 'Pencil Sketch', size: '11x14', numberOfFaces: 3, basePrice: 4500 },
    { style: 'Pencil Sketch', size: '16x20', numberOfFaces: 1, basePrice: 3500 },
    { style: 'Pencil Sketch', size: '16x20', numberOfFaces: 2, basePrice: 4500 },
    { style: 'Pencil Sketch', size: '16x20', numberOfFaces: 3, basePrice: 5500 },
  ]

  for (const rule of pricingRules) {
    await prisma.pricing.upsert({
      where: {
        style_size_numberOfFaces: {
          style: rule.style,
          size: rule.size,
          numberOfFaces: rule.numberOfFaces,
        },
      },
      update: {},
      create: rule,
    })
  }

  console.log('✅ Pricing rules created')

  // Create sample frames
  const frames = [
    {
      name: 'Classic Wood Frame',
      description: 'Beautiful wooden frame with natural finish',
      imageUrl: '/frames/wood-frame.svg',
      publicId: 'wood_frame',
      price: 500,
      order: 1,
    },
    {
      name: 'Modern Black Frame',
      description: 'Sleek black frame perfect for contemporary art',
      imageUrl: '/frames/black-frame.svg',
      publicId: 'black_frame',
      price: 400,
      order: 2,
    },
    {
      name: 'Elegant Gold Frame',
      description: 'Luxurious gold frame for premium portraits',
      imageUrl: '/frames/gold-frame.svg',
      publicId: 'gold_frame',
      price: 800,
      order: 3,
    },
  ]

  for (const frame of frames) {
    await prisma.frame.upsert({
      where: { id: frame.name.toLowerCase().replace(/\s+/g, '_') },
      update: {},
      create: {
        id: frame.name.toLowerCase().replace(/\s+/g, '_'),
        ...frame
      },
    })
  }

  console.log('✅ Sample frames created')

  // Create sample offers
  const offers = [
    {
      title: 'New Customer Discount',
      description: 'Special 20% discount for first-time customers',
      type: 'FIRST_ORDER_DISCOUNT',
      value: 20,
      maxDiscount: 1000,
      couponCode: 'WELCOME20',
      priority: 10,
      firstOrderOnly: true,
    },
    {
      title: 'Multiple Portrait Discount',
      description: 'Flat ₹500 off on orders with 2 or more people',
      type: 'FLAT_DISCOUNT',
      value: 500,
      couponCode: 'FAMILY500',
      minOrderValue: 3000,
      priority: 5,
    },
    {
      title: 'Premium Size Upgrade',
      description: 'Get 15% off on 16x20 size portraits',
      type: 'PERCENTAGE_DISCOUNT',
      value: 15,
      couponCode: 'LARGE15',
      minOrderValue: 4000,
      priority: 3,
      applicableStyles: ['Charcoal', 'Pencil Sketch'],
    },
  ]

  for (const offer of offers) {
    await prisma.offer.upsert({
      where: { couponCode: offer.couponCode },
      update: {},
      create: offer as any,
    })
  }

  console.log('✅ Sample offers created')

  // Create sample gallery images - Only Charcoal and Pencil
  const galleryImages = [
    {
      title: 'Charcoal Portrait Sample 1',
      description: 'Beautiful charcoal portrait showcasing our artistic style',
      imageUrl: '/artworks/WhatsApp Image 2025-12-31 at 10.47.38 AM (1).jpeg',
      publicId: 'charcoal_sample_1',
      style: 'Charcoal',
      tags: ['portrait', 'charcoal', 'artistic'],
      order: 1,
    },
    {
      title: 'Charcoal Portrait Sample 2',
      description: 'Detailed charcoal artwork with rich textures',
      imageUrl: '/artworks/WhatsApp Image 2025-12-31 at 10.47.38 AM.jpeg',
      publicId: 'charcoal_sample_2',
      style: 'Charcoal',
      tags: ['portrait', 'charcoal', 'detailed'],
      order: 2,
    },
    {
      title: 'Charcoal Portrait Sample 3',
      description: 'Expressive charcoal portrait with fine artistic technique',
      imageUrl: '/artworks/WhatsApp Image 2025-12-31 at 10.47.39 AM.jpeg',
      publicId: 'charcoal_sample_3',
      style: 'Charcoal',
      tags: ['portrait', 'charcoal', 'expressive'],
      order: 3,
    },
    {
      title: 'Pencil Sketch Sample',
      description: 'Detailed pencil sketch showing fine artistic technique',
      imageUrl: '/artworks/WhatsApp Image 2025-12-31 at 10.47.40 AM (1).jpeg',
      publicId: 'pencil_sample',
      style: 'Pencil Sketch',
      tags: ['portrait', 'pencil', 'sketch'],
      order: 4,
    },
  ]

  for (const image of galleryImages) {
    await prisma.galleryImage.upsert({
      where: { id: image.publicId },
      update: {},
      create: {
        id: image.publicId,
        ...image
      },
    })
  }

  console.log('✅ Sample gallery images created')

  // Create admin settings
  await prisma.adminSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      whatsappNumber: '919876543210',
      bannerTitle: 'Charcoal & Pencil Portraits!',
      bannerText: 'Professional charcoal and pencil portraits. Get 20% off your first order with code WELCOME20',
      bannerActive: true,
    },
  })

  console.log('✅ Admin settings created')

  console.log('🎉 Admin data seeding completed!')
  console.log('')
  console.log('Admin Login Credentials:')
  console.log('Email: admin@portraitstudio.com')
  console.log('Password: admin123')
  console.log('')
  console.log('You can now access the admin panel at /admin')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })