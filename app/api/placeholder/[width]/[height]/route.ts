import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { width: string; height: string } }
) {
  try {
    const { width, height } = params
    const { searchParams } = new URL(request.url)
    const name = searchParams.get('name') || 'Image'
    
    // Validate dimensions
    const w = Math.min(Math.max(parseInt(width) || 400, 50), 2000)
    const h = Math.min(Math.max(parseInt(height) || 500, 50), 2000)
    
    // Create SVG placeholder
    const svg = `
      <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#1a1a1a"/>
        <rect x="10%" y="10%" width="80%" height="80%" fill="#2a2a2a" stroke="#404040" stroke-width="2"/>
        <text x="50%" y="45%" font-family="Arial, sans-serif" font-size="16" fill="#666" text-anchor="middle">
          📷 Image Placeholder
        </text>
        <text x="50%" y="60%" font-family="Arial, sans-serif" font-size="12" fill="#555" text-anchor="middle">
          ${name.substring(0, 30)}${name.length > 30 ? '...' : ''}
        </text>
        <text x="50%" y="75%" font-family="Arial, sans-serif" font-size="10" fill="#444" text-anchor="middle">
          ${w} × ${h}
        </text>
      </svg>
    `
    
    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('Placeholder generation error:', error)
    
    // Fallback minimal SVG
    const fallbackSvg = `
      <svg width="400" height="500" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#1a1a1a"/>
        <text x="50%" y="50%" font-family="Arial" font-size="16" fill="#666" text-anchor="middle">
          Image Unavailable
        </text>
      </svg>
    `
    
    return new NextResponse(fallbackSvg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  }
}