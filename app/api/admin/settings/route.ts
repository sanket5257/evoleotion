import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'

// Force dynamic rendering to prevent static evaluation during build
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  try {
    await requireAdmin()

    const settings = await prisma.adminSettings.findFirst()

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
    const existingSettings = await prisma.adminSettings.findFirst()

    let settings
    if (existingSettings) {
      // Update existing settings
      settings = await prisma.adminSettings.update({
        where: { id: existingSettings.id },
        data: {
          whatsappNumber,
          bannerTitle: bannerTitle || null,
          bannerText: bannerText || null,
          bannerActive: bannerActive || false
        }
      })
    } else {
      // Create new settings
      settings = await prisma.adminSettings.create({
        data: {
          whatsappNumber,
          bannerTitle: bannerTitle || null,
          bannerText: bannerText || null,
          bannerActive: bannerActive || false
        }
      })
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