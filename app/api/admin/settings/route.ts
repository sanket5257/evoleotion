import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { supabaseServer } from '@/lib/supabase-server'

// Force dynamic rendering to prevent static evaluation during build
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  try {
    await requireAdmin()

    const { data: settings, error } = await supabaseServer
      .from('admin_settings')
      .select('*')
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      console.error('Error fetching settings:', error)
      return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
    }

    return NextResponse.json(settings)
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Error fetching settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin()

    const body = await request.json()
    const { whatsappNumber, bannerTitle, bannerText, bannerActive } = body

    if (!whatsappNumber) {
      return NextResponse.json({ error: 'WhatsApp number is required' }, { status: 400 })
    }

    // Check if settings already exist
    const { data: existingSettings } = await supabaseServer
      .from('admin_settings')
      .select('*')
      .limit(1)
      .single()

    let settings
    if (existingSettings) {
      // Update existing settings
      const { data, error } = await supabaseServer
        .from('admin_settings')
        .update({
          whatsappNumber,
          bannerTitle: bannerTitle || null,
          bannerText: bannerText || null,
          bannerActive: bannerActive || false,
          updatedAt: new Date().toISOString()
        })
        .eq('id', existingSettings.id)
        .select()
        .single()

      if (error) {
        console.error('Error updating settings:', error)
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
      }
      settings = data
    } else {
      // Create new settings
      const { data, error } = await supabaseServer
        .from('admin_settings')
        .insert({
          id: crypto.randomUUID(),
          whatsappNumber,
          bannerTitle: bannerTitle || null,
          bannerText: bannerText || null,
          bannerActive: bannerActive || false,
          updatedAt: new Date().toISOString()
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating settings:', error)
        return NextResponse.json({ error: 'Failed to create settings' }, { status: 500 })
      }
      settings = data
    }

    return NextResponse.json(settings)
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Error saving settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}