const { PrismaClient } = require('@prisma/client')

async function createTestOrder() {
  const prisma = new PrismaClient()
  
  try {
    console.log('🔍 Creating test order...\n')
    
    // Find or create a test user
    let user = await prisma.user.findFirst({
      where: { email: 'test@example.com' }
    })
    
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: 'test@example.com',
          name: 'Test User',
          role: 'USER'
        }
      })
      console.log('✅ Created test user:', user.email)
    } else {
      console.log('✅ Found existing test user:', user.email)
    }
    
    // Generate order number
    const orderNumber = `ORD-${Date.now().toString().slice(-8)}`
    
    // Create test order
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: user.id,
        customerName: 'Test User',
        customerEmail: 'test@example.com',
        customerPhone: '+91 9876543210',
        style: 'Charcoal Portrait',
        size: 'A5 (5.8×8.3 IN)',
        numberOfFaces: 1,
        basePrice: 750,
        discountAmount: 0,
        finalPrice: 750,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        specialNotes: 'This is a test order created for dashboard testing.'
      }
    })
    
    console.log('✅ Created test order:', order.orderNumber)
    console.log('📋 Order details:')
    console.log(`   - Style: ${order.style}`)
    console.log(`   - Size: ${order.size}`)
    console.log(`   - Price: ₹${order.finalPrice}`)
    console.log(`   - Status: ${order.status}`)
    
    // Create test order images
    await prisma.orderImage.create({
      data: {
        orderId: order.id,
        imageUrl: '/api/placeholder/400/500?text=Test+Photo+1'
      }
    })
    
    await prisma.orderImage.create({
      data: {
        orderId: order.id,
        imageUrl: '/api/placeholder/400/500?text=Test+Photo+2'
      }
    })
    
    console.log('✅ Added test images to order')
    
    console.log('\n🎉 Test order created successfully!')
    console.log('\nNow you can:')
    console.log('1. Sign in as test@example.com (create account if needed)')
    console.log('2. Go to /dashboard to see the test order')
    console.log('3. Click "View Details" to test the modal')
    
  } catch (error) {
    console.error('❌ Error creating test order:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

createTestOrder()