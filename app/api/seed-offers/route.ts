import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

// Force dynamic rendering to prevent static evaluation during build
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST() {
  try {

    // Check if database connection is available
    if (!supabaseServer) {
      return NextResponse.json(
        { error: 'Database connection not available' },
        { status: 500 }
      )
    }
    // Check if offers data already exists
    const { data: existingOffers, error: checkError } = await supabaseServer
      .from('offers')
      .select('id')
      .limit(1)

    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError
    }

    if (existingOffers && existingOffers.length > 0) {
      return NextResponse.json({
        success: false,
        message: 'Offers data already exists. Delete existing data first if you want to reseed.',
        existingCount: existingOffers.length
      })
    }

    // Sample offers data with correct enum values
    const offersData = [
      {
        id: crypto.randomUUID(),
        title: 'First Order Discount',
        description: 'Get 10% off on your first portrait order',
        type: 'PERCENTAGE_DISCOUNT',
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
        type: 'FLAT_DISCOUNT',
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
        type: 'PERCENTAGE_DISCOUNT',
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
    const { data: insertedOffers, error: insertError } = await supabaseServer
      .from('offers')
      .insert(offersData)
      .select()

    if (insertError) {
      throw insertError
    }

    return NextResponse.json({
      success: true,
      message: 'Offers data seeded successfully',
      data: {
        offersCount: insertedOffers?.length || 0,
        offers: insertedOffers
      }
    })

  } catch (error) {
    console.error('Error seeding offers data:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 })
  }
}

export async function DELETE() {
  try {

    // Check if database connection is available
    if (!supabaseServer) {
      return NextResponse.json(
        { error: 'Database connection not available' },
        { status: 500 }
      )
    }
    // Delete all offers
    const { error } = await supabaseServer
      .from('offers')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      message: 'All offers data deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting offers data:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 })
  }
}