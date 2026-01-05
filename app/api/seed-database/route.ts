import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

export const dynamic = 'force-dynamic'

export async function POST() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    console.log('🌱 Seeding database with initial data...')

    // Step 1: Create admin user
    const hashedAdminPassword = await bcrypt.hash('admin123', 12)
    
    const { data: adminUser, error: adminError } = await supabase
      .from('users')
      .upsert({
        id: crypto.randomUUID(),
        email: 'admin@test.com',
        name: 'Admin User',
        password: hashedAdminPassword,
        role: 'ADMIN',
        updatedAt: new Date().toISOString()
      }, {
        onConflict: 'email'
      })
      .select()

    if (adminError && adminError.code !== '23505') {
      console.error('Admin user creation error:', adminError)
      return NextResponse.json({
        status: 'error',
        error: 'Failed to create admin user',
        details: adminError.message,
        timestamp: new Date().toISOString()
      }, { status: 500 })
    }

    console.log('👤 Admin user created/updated')

    // Step 2: Create test user
    const hashedTestPassword = await bcrypt.hash('password123', 12)
    
    const { error: testUserError } = await supabase
      .from('users')
      .upsert({
        id: crypto.randomUUID(),
        email: 'test@example.com',
        name: 'Test User',
        password: hashedTestPassword,
        role: 'USER',
        updatedAt: new Date().toISOString()
      }, {
        onConflict: 'email'
      })

    if (testUserError && testUserError.code !== '23505') {
      console.warn('Test user creation warning:', testUserError.message)
    }

    console.log('👤 Test user created/updated')

    // Step 3: Create sample gallery images
    const galleryImages = [
      {
        title: 'Charcoal Portrait',
        description: 'Beautiful charcoal style portrait with rich textures',
        imageUrl: '/api/placeholder/400/500',
        publicId: 'sample-charcoal-1',
        style: 'Charcoal',
        tags: ['portrait', 'charcoal', 'artistic'],
        isActive: true,
        order: 1,
      },
      {
        title: 'Pencil Sketch Portrait',
        description: 'Detailed pencil sketch with realistic shading',
        imageUrl: '/api/placeholder/400/500',
        publicId: 'sample-pencil-1',
        style: 'Pencil Sketch',
        tags: ['portrait', 'pencil', 'sketch'],
        isActive: true,
        order: 2,
      },
      {
        title: 'Charcoal Family Portrait',
        description: 'Family portrait in charcoal style',
        imageUrl: '/api/placeholder/400/500',
        publicId: 'sample-charcoal-2',
        style: 'Charcoal',
        tags: ['family', 'charcoal', 'group'],
        isActive: true,
        order: 3,
      },
      {
        title: 'Pencil Couple Portrait',
        description: 'Romantic couple portrait in pencil',
        imageUrl: '/api/placeholder/400/500',
        publicId: 'sample-pencil-2',
        style: 'Pencil Sketch',
        tags: ['couple', 'pencil', 'romantic'],
        isActive: true,
        order: 4,
      },
    ]

    for (const image of galleryImages) {
      const { error } = await supabase
        .from('gallery_images')
        .upsert({
          ...image,
          id: crypto.randomUUID(),
          updatedAt: new Date().toISOString()
        }, {
          onConflict: 'publicId'
        })
      
      if (error && error.code !== '23505') {
        console.warn('Gallery image creation warning:', error.message)
      }
    }

    console.log('🖼️ Gallery images created/updated')

    // Step 4: Create pricing rules
    const pricingRules = [
      // Charcoal pricing
      { style: 'Charcoal', size: '8x10', numberOfFaces: 1, basePrice: 1999 },
      { style: 'Charcoal', size: '8x10', numberOfFaces: 2, basePrice: 2999 },
      { style: 'Charcoal', size: '11x14', numberOfFaces: 1, basePrice: 2999 },
      { style: 'Charcoal', size: '11x14', numberOfFaces: 2, basePrice: 3999 },
      // Pencil Sketch pricing
      { style: 'Pencil Sketch', size: '8x10', numberOfFaces: 1, basePrice: 1999 },
      { style: 'Pencil Sketch', size: '8x10', numberOfFaces: 2, basePrice: 2999 },
      { style: 'Pencil Sketch', size: '11x14', numberOfFaces: 1, basePrice: 2999 },
      { style: 'Pencil Sketch', size: '11x14', numberOfFaces: 2, basePrice: 3999 },
    ]

    for (const pricing of pricingRules) {
      const { error } = await supabase
        .from('pricing')
        .upsert({
          ...pricing,
          id: crypto.randomUUID(),
          isActive: true,
          updatedAt: new Date().toISOString()
        }, {
          onConflict: 'style,size,numberOfFaces'
        })
      
      if (error && error.code !== '23505') {
        console.warn('Pricing rule creation warning:', error.message)
      }
    }

    console.log('💰 Pricing rules created/updated')

    // Step 5: Create sample offers
    const offers = [
      {
        title: 'New Year Special',
        description: '20% off all portraits - Limited time offer!',
        type: 'PERCENTAGE_DISCOUNT',
        value: 20,
        maxDiscount: 2000,
        isActive: true,
        priority: 10,
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
      const { error } = await supabase
        .from('offers')
        .upsert({
          ...offer,
          id: crypto.randomUUID(),
          updatedAt: new Date().toISOString()
        }, {
          onConflict: offer.couponCode ? 'couponCode' : undefined
        })
      
      if (error && error.code !== '23505') {
        console.warn('Offer creation warning:', error.message)
      }
    }

    console.log('🎁 Offers created/updated')

    // Step 6: Create admin settings
    const { error: settingsError } = await supabase
      .from('admin_settings')
      .upsert({
        id: crypto.randomUUID(),
        whatsappNumber: '917083259985',
        bannerTitle: 'Limited Time Offer!',
        bannerText: 'Get 20% off on all portrait orders. Use code SAVE20',
        bannerActive: true,
        updatedAt: new Date().toISOString()
      })

    if (settingsError && settingsError.code !== '23505') {
      console.warn('Admin settings creation warning:', settingsError.message)
    }

    console.log('⚙️ Admin settings created/updated')

    // Get final counts
    const { count: userCount } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })

    const { count: galleryCount } = await supabase
      .from('gallery_images')
      .select('*', { count: 'exact', head: true })

    const { count: pricingCount } = await supabase
      .from('pricing')
      .select('*', { count: 'exact', head: true })

    console.log('✅ Database seeded successfully!')

    return NextResponse.json({
      status: 'success',
      message: 'Database seeded successfully!',
      data: {
        users: userCount || 0,
        galleryImages: galleryCount || 0,
        pricingRules: pricingCount || 0,
        offers: 3,
        adminSettings: 1
      },
      credentials: {
        admin: 'admin@test.com (password: admin123)',
        test: 'test@example.com (password: password123)'
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Error seeding database:', error)
    return NextResponse.json({
      status: 'error',
      error: 'Database seeding failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}