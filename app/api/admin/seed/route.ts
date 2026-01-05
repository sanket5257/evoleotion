import { NextRequest, NextResponse } from 'next/server'

import { requireAdmin, requireAdminFromRequest } from '@/lib/admin-auth'
import { supabaseServer } from '@/lib/supabase-server'

// Force dynamic rendering to prevent static evaluation during build
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(_request: NextRequest) {
  try {
    await requireAdmin()

    // Check if data already exists
    const { count: existingImages } = await supabaseServer
      .from('gallery_images')
      .select('*', { count: 'exact', head: true })

    const { count: existingPricing } = await supabaseServer
      .from('pricing')
      .select('*', { count: 'exact', head: true })
    
    if ((existingImages || 0) > 0 && (existingPricing || 0) > 0) {
      return NextResponse.json({ 
        message: 'Database already seeded',
        stats: {
          images: existingImages || 0,
          pricing: existingPricing || 0
        }
      })
    }

    // Create sample gallery images
    const galleryImages = [
      {
        id: crypto.randomUUID(),
        title: 'Charcoal Portrait',
        description: 'Beautiful charcoal style portrait with rich textures',
        imageUrl: '/api/placeholder/400/500',
        publicId: 'sample-charcoal-1',
        style: 'Charcoal',
        tags: ['portrait', 'charcoal', 'artistic'],
        isActive: true,
        orderIndex: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: crypto.randomUUID(),
        title: 'Pencil Sketch Portrait',
        description: 'Detailed pencil sketch with realistic shading',
        imageUrl: '/api/placeholder/400/500',
        publicId: 'sample-pencil-1',
        style: 'Pencil Sketch',
        tags: ['portrait', 'pencil', 'sketch'],
        isActive: true,
        orderIndex: 2,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: crypto.randomUUID(),
        title: 'Charcoal Family Portrait',
        description: 'Family portrait in charcoal style',
        imageUrl: '/api/placeholder/400/500',
        publicId: 'sample-charcoal-2',
        style: 'Charcoal',
        tags: ['family', 'charcoal', 'group'],
        isActive: true,
        orderIndex: 3,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: crypto.randomUUID(),
        title: 'Pencil Couple Portrait',
        description: 'Romantic couple portrait in pencil',
        imageUrl: '/api/placeholder/400/500',
        publicId: 'sample-pencil-2',
        style: 'Pencil Sketch',
        tags: ['couple', 'pencil', 'romantic'],
        isActive: true,
        orderIndex: 4,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
    ]

    const { error: imagesError } = await supabaseServer
      .from('gallery_images')
      .insert(galleryImages)

    if (imagesError) {
      console.error('Error inserting gallery images:', imagesError)
      throw imagesError
    }

    // Create pricing rules
    const styles = ['Charcoal', 'Pencil Sketch']
    const sizes = ['8x10', '11x14', '16x20', '18x24']
    const faces = [1, 2, 3, 4, 5]

    const basePrices = {
      '8x10': { 1: 1999, 2: 2999, 3: 3999, 4: 4999, 5: 5999 },
      '11x14': { 1: 2999, 2: 3999, 3: 4999, 4: 5999, 5: 6999 },
      '16x20': { 1: 3999, 2: 4999, 3: 5999, 4: 6999, 5: 7999 },
      '18x24': { 1: 4999, 2: 5999, 3: 6999, 4: 7999, 5: 8999 },
    }

    const pricingRules = []
    for (const style of styles) {
      for (const size of sizes) {
        for (const faceCount of faces) {
          pricingRules.push({
            id: crypto.randomUUID(),
            style,
            size,
            numberOfFaces: faceCount,
            basePrice: basePrices[size as keyof typeof basePrices][faceCount as keyof typeof basePrices['8x10']],
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          })
        }
      }
    }

    const { error: pricingError } = await supabaseServer
      .from('pricing')
      .insert(pricingRules)

    if (pricingError) {
      console.error('Error inserting pricing rules:', pricingError)
      throw pricingError
    }

    // Create sample offers
    const offers = [
      {
        id: crypto.randomUUID(),
        title: 'New Year Special',
        description: '20% off all portraits - Limited time offer!',
        type: 'PERCENTAGE_DISCOUNT',
        value: 20,
        maxDiscount: 2000,
        isActive: true,
        priority: 10,
        startDate: new Date('2024-01-01').toISOString(),
        endDate: new Date('2024-12-31').toISOString(),
        applicableStyles: [],
        firstOrderOnly: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: crypto.randomUUID(),
        title: 'First Order Discount',
        description: 'Get 15% off your first portrait order',
        type: 'FIRST_ORDER_DISCOUNT',
        value: 15,
        maxDiscount: 1500,
        isActive: true,
        priority: 5,
        applicableStyles: [],
        firstOrderOnly: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: crypto.randomUUID(),
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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
    ]

    const { error: offersError } = await supabaseServer
      .from('offers')
      .insert(offers)

    if (offersError) {
      console.error('Error inserting offers:', offersError)
      throw offersError
    }

    // Create admin settings if they don't exist
    const { data: existingSettings } = await supabaseServer
      .from('admin_settings')
      .select('*')
      .limit(1)
      .single()

    if (!existingSettings) {
      const { error: settingsError } = await supabaseServer
        .from('admin_settings')
        .insert({
          id: crypto.randomUUID(),
          whatsappNumber: '917083259985',
          bannerTitle: 'Limited Time Offer!',
          bannerText: 'Get 20% off on all portrait orders. Use code SAVE20',
          bannerActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })

      if (settingsError) {
        console.error('Error inserting admin settings:', settingsError)
        throw settingsError
      }
    }

    // Get final counts
    const { count: finalImages } = await supabaseServer
      .from('gallery_images')
      .select('*', { count: 'exact', head: true })

    const { count: finalPricing } = await supabaseServer
      .from('pricing')
      .select('*', { count: 'exact', head: true })

    const { count: finalOffers } = await supabaseServer
      .from('offers')
      .select('*', { count: 'exact', head: true })

    const { count: finalSettings } = await supabaseServer
      .from('admin_settings')
      .select('*', { count: 'exact', head: true })

    const finalStats = {
      images: finalImages || 0,
      pricing: finalPricing || 0,
      offers: finalOffers || 0,
      settings: finalSettings || 0,
    }

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully!',
      stats: finalStats
    })

  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('❌ Error seeding database:', error)
    return NextResponse.json({ 
      error: 'Failed to seed database',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}