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

    // Fetch all gallery images
    const { data: images, error } = await supabaseServer
      .from('gallery_images')
      .select('*')
      .order('createdAt', { ascending: false })

    if (error) {
      console.error('Error fetching gallery images:', error)
      return NextResponse.json({ error: 'Failed to fetch gallery images' }, { status: 500 })
    }

    // Convert to CSV format
    const csvHeaders = [
      'ID',
      'Title',
      'Description',
      'Image URL',
      'Style',
      'Tags',
      'Order Index',
      'Is Active',
      'Created At',
      'Updated At'
    ]

    const csvRows = images?.map(image => [
      image.id,
      image.title,
      image.description || '',
      image.imageUrl,
      image.style,
      Array.isArray(image.tags) ? image.tags.join('; ') : '',
      image.orderIndex || 0,
      image.isActive ? 'Yes' : 'No',
      new Date(image.createdAt).toLocaleString(),
      new Date(image.updatedAt).toLocaleString()
    ]) || []

    // Create CSV content
    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
    ].join('\n')

    // Return CSV file
    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="gallery-export-${new Date().toISOString().split('T')[0]}.csv"`
      }
    })
  } catch (error) {
    console.error('Error in gallery export API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}