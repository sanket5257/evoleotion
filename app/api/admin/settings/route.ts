import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'
import { getSession } from '@/lib/session'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Check authentication and admin role
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if database connection is available
    if (!supabaseServer) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 500 })
    }

    const { data: settings, error } = await supabaseServer
      .from('admin_settings')
      .select('*')
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      console.error('Error fetching settings:', error)
      return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
    }

    return NextResponse.json(settings || {})
  } catch (error) {
    console.error('Error in settings GET API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication and admin role
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if database connection is available
    if (!supabaseServer) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 500 })
    }

    const body = await request.json()
    const { whatsappNumber, bannerTitle, bannerText, bannerActive } = body

    // Validate required fields
    if (!whatsappNumber) {
      return NextResponse.json({ error: 'WhatsApp number is required' }, { status: 400 })
    }

    // Check if settings exist
    const { data: existingSettings } = await supabaseServer
      .from('admin_settings')
      .select('id')
      .limit(1)
      .single()

    const settingsData = {
      whatsappNumber,
      bannerTitle: bannerTitle || null,
      bannerText: bannerText || null,
      bannerActive: Boolean(bannerActive),
      updatedAt: new Date().toISOString()
    }

    let result
    if (existingSettings) {
      // Update existing settings
      const { data, error } = await supabaseServer
        .from('admin_settings')
        .update(settingsData)
        .eq('id', existingSettings.id)
        .select()
        .single()

      if (error) {
        console.error('Error updating settings:', error)
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
      }
      result = data
    } else {
      // Create new settings
      const { data, error } = await supabaseServer
        .from('admin_settings')
        .insert({
          ...settingsData,
          createdAt: new Date().toISOString()
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating settings:', error)
        return NextResponse.json({ error: 'Failed to create settings' }, { status: 500 })
      }
      result = data
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error in settings POST API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}