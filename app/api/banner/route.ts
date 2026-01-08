import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Check if database connection is available
    if (!supabaseServer) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 500 })
    }

    const { data: settings, error } = await supabaseServer
      .from('admin_settings')
      .select('bannerTitle, bannerText, bannerActive')
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      console.error('Error fetching banner settings:', error)
      return NextResponse.json({ error: 'Failed to fetch banner settings' }, { status: 500 })
    }

    // Return banner data or null if not found/inactive
    if (!settings || !settings.bannerActive) {
      return NextResponse.json(null)
    }

    return NextResponse.json({
      title: settings.bannerTitle,
      text: settings.bannerText,
      active: settings.bannerActive
    })
  } catch (error) {
    console.error('Error in banner API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}