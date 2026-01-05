import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

// Force dynamic rendering to prevent static evaluation during build
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST() {
  try {
    // Define pricing data based on the price chart
    const pricingData = [
      // A5 size (5.8×8.3 IN) - 600RS
      {
        id: crypto.randomUUID(),
        style: 'Portrait',
        size: 'A5',
        numberOfFaces: 1,
        basePrice: 600,
        isActive: true,
        updatedAt: new Date().toISOString()
      },
      {
        id: crypto.randomUUID(),
        style: 'Sketch',
        size: 'A5',
        numberOfFaces: 1,
        basePrice: 600,
        isActive: true,
        updatedAt: new Date().toISOString()
      },
      {
        id: crypto.randomUUID(),
        style: 'Realistic',
        size: 'A5',
        numberOfFaces: 1,
        basePrice: 600,
        isActive: true,
        updatedAt: new Date().toISOString()
      },

      // A4 size (8.3×11.7 IN) - 1500RS
      {
        id: crypto.randomUUID(),
        style: 'Portrait',
        size: 'A4',
        numberOfFaces: 1,
        basePrice: 1500,
        isActive: true,
        updatedAt: new Date().toISOString()
      },
      {
        id: crypto.randomUUID(),
        style: 'Sketch',
        size: 'A4',
        numberOfFaces: 1,
        basePrice: 1500,
        isActive: true,
        updatedAt: new Date().toISOString()
      },
      {
        id: crypto.randomUUID(),
        style: 'Realistic',
        size: 'A4',
        numberOfFaces: 1,
        basePrice: 1500,
        isActive: true,
        updatedAt: new Date().toISOString()
      },

      // A3 size (11.7×16.5 IN) - 2200RS
      {
        id: crypto.randomUUID(),
        style: 'Portrait',
        size: 'A3',
        numberOfFaces: 1,
        basePrice: 2200,
        isActive: true,
        updatedAt: new Date().toISOString()
      },
      {
        id: crypto.randomUUID(),
        style: 'Sketch',
        size: 'A3',
        numberOfFaces: 1,
        basePrice: 2200,
        isActive: true,
        updatedAt: new Date().toISOString()
      },
      {
        id: crypto.randomUUID(),
        style: 'Realistic',
        size: 'A3',
        numberOfFaces: 1,
        basePrice: 2200,
        isActive: true,
        updatedAt: new Date().toISOString()
      },

      // A2 size (16.5×23.4 IN) - 3500RS
      {
        id: crypto.randomUUID(),
        style: 'Portrait',
        size: 'A2',
        numberOfFaces: 1,
        basePrice: 3500,
        isActive: true,
        updatedAt: new Date().toISOString()
      },
      {
        id: crypto.randomUUID(),
        style: 'Sketch',
        size: 'A2',
        numberOfFaces: 1,
        basePrice: 3500,
        isActive: true,
        updatedAt: new Date().toISOString()
      },
      {
        id: crypto.randomUUID(),
        style: 'Realistic',
        size: 'A2',
        numberOfFaces: 1,
        basePrice: 3500,
        isActive: true,
        updatedAt: new Date().toISOString()
      },

      // Multiple faces pricing (add 50% for each additional face)
      // A5 - 2 faces
      {
        id: crypto.randomUUID(),
        style: 'Portrait',
        size: 'A5',
        numberOfFaces: 2,
        basePrice: 900, // 600 + 50%
        isActive: true,
        updatedAt: new Date().toISOString()
      },
      {
        id: crypto.randomUUID(),
        style: 'Sketch',
        size: 'A5',
        numberOfFaces: 2,
        basePrice: 900,
        isActive: true,
        updatedAt: new Date().toISOString()
      },
      {
        id: crypto.randomUUID(),
        style: 'Realistic',
        size: 'A5',
        numberOfFaces: 2,
        basePrice: 900,
        isActive: true,
        updatedAt: new Date().toISOString()
      },

      // A4 - 2 faces
      {
        id: crypto.randomUUID(),
        style: 'Portrait',
        size: 'A4',
        numberOfFaces: 2,
        basePrice: 2250, // 1500 + 50%
        isActive: true,
        updatedAt: new Date().toISOString()
      },
      {
        id: crypto.randomUUID(),
        style: 'Sketch',
        size: 'A4',
        numberOfFaces: 2,
        basePrice: 2250,
        isActive: true,
        updatedAt: new Date().toISOString()
      },
      {
        id: crypto.randomUUID(),
        style: 'Realistic',
        size: 'A4',
        numberOfFaces: 2,
        basePrice: 2250,
        isActive: true,
        updatedAt: new Date().toISOString()
      },

      // A3 - 2 faces
      {
        id: crypto.randomUUID(),
        style: 'Portrait',
        size: 'A3',
        numberOfFaces: 2,
        basePrice: 3300, // 2200 + 50%
        isActive: true,
        updatedAt: new Date().toISOString()
      },
      {
        id: crypto.randomUUID(),
        style: 'Sketch',
        size: 'A3',
        numberOfFaces: 2,
        basePrice: 3300,
        isActive: true,
        updatedAt: new Date().toISOString()
      },
      {
        id: crypto.randomUUID(),
        style: 'Realistic',
        size: 'A3',
        numberOfFaces: 2,
        basePrice: 3300,
        isActive: true,
        updatedAt: new Date().toISOString()
      },

      // A2 - 2 faces
      {
        id: crypto.randomUUID(),
        style: 'Portrait',
        size: 'A2',
        numberOfFaces: 2,
        basePrice: 5250, // 3500 + 50%
        isActive: true,
        updatedAt: new Date().toISOString()
      },
      {
        id: crypto.randomUUID(),
        style: 'Sketch',
        size: 'A2',
        numberOfFaces: 2,
        basePrice: 5250,
        isActive: true,
        updatedAt: new Date().toISOString()
      },
      {
        id: crypto.randomUUID(),
        style: 'Realistic',
        size: 'A2',
        numberOfFaces: 2,
        basePrice: 5250,
        isActive: true,
        updatedAt: new Date().toISOString()
      }
    ]

    // Check if pricing data already exists
    const { data: existingPricing, error: checkError } = await supabaseServer
      .from('pricing')
      .select('id')
      .limit(1)

    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError
    }

    if (existingPricing && existingPricing.length > 0) {
      return NextResponse.json({
        success: false,
        message: 'Pricing data already exists. Delete existing data first if you want to reseed.',
        existingCount: existingPricing.length
      })
    }

    // Insert pricing data
    const { data: insertedPricing, error: insertError } = await supabaseServer
      .from('pricing')
      .insert(pricingData)
      .select()

    if (insertError) {
      throw insertError
    }

    // Also seed some sample offers
    const offersData = [
      {
        id: crypto.randomUUID(),
        title: 'First Order Discount',
        description: 'Get 10% off on your first portrait order',
        type: 'PERCENTAGE',
        value: 10,
        maxDiscount: 500,
        couponCode: 'FIRST10',
        isActive: true,
        priority: 10,
        firstOrderOnly: true,
        minOrderValue: 500,
        applicableStyles: ['Portrait', 'Sketch', 'Realistic'],
        updatedAt: new Date().toISOString()
      },
      {
        id: crypto.randomUUID(),
        title: 'Weekend Special',
        description: 'Flat ₹200 off on orders above ₹1000',
        type: 'FIXED',
        value: 200,
        couponCode: 'WEEKEND200',
        isActive: true,
        priority: 5,
        firstOrderOnly: false,
        minOrderValue: 1000,
        applicableStyles: ['Portrait', 'Sketch', 'Realistic'],
        updatedAt: new Date().toISOString()
      },
      {
        id: crypto.randomUUID(),
        title: 'Premium Portrait Deal',
        description: '15% off on A3 and A2 size portraits',
        type: 'PERCENTAGE',
        value: 15,
        maxDiscount: 750,
        couponCode: 'PREMIUM15',
        isActive: true,
        priority: 8,
        firstOrderOnly: false,
        minOrderValue: 2000,
        applicableStyles: ['Portrait', 'Realistic'],
        updatedAt: new Date().toISOString()
      }
    ]

    // Insert offers
    const { data: insertedOffers, error: offersError } = await supabaseServer
      .from('offers')
      .insert(offersData)
      .select()

    if (offersError) {
      console.warn('Failed to insert offers:', offersError)
    }

    // Create admin settings
    const { data: existingSettings } = await supabaseServer
      .from('admin_settings')
      .select('id')
      .limit(1)
      .single()

    if (!existingSettings) {
      const { error: settingsError } = await supabaseServer
        .from('admin_settings')
        .insert({
          id: crypto.randomUUID(),
          whatsappNumber: '917083259985',
          bannerTitle: 'Free Delivery + Photo Frame',
          bannerText: 'Get your custom portrait delivered for free with a beautiful photo frame',
          bannerActive: true,
          updatedAt: new Date().toISOString()
        })

      if (settingsError) {
        console.warn('Failed to create admin settings:', settingsError)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Pricing data seeded successfully',
      data: {
        pricingCount: insertedPricing?.length || 0,
        offersCount: insertedOffers?.length || 0,
        pricing: insertedPricing,
        offers: insertedOffers
      }
    })

  } catch (error) {
    console.error('Error seeding pricing data:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    // Delete all pricing data
    const { error: pricingError } = await supabaseServer
      .from('pricing')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all

    if (pricingError) {
      throw pricingError
    }

    // Delete all offers
    const { error: offersError } = await supabaseServer
      .from('offers')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all

    if (offersError) {
      console.warn('Failed to delete offers:', offersError)
    }

    return NextResponse.json({
      success: true,
      message: 'All pricing and offers data deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting pricing data:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 })
  }
}