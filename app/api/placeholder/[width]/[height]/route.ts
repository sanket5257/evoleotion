import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

interface RouteParams {
  params: { width: string; height: string }
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { width, height } = params
    const { searchParams } = new URL(request.url)
    const text = searchParams.get('text') || 'No Image'
    const bgColor = searchParams.get('bg') || 'f0f0f0'
    const textColor = searchParams.get('color') || '666666'

    // Create SVG placeholder
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#${bgColor}"/>
        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="16" fill="#${textColor}" text-anchor="middle" dy=".3em">
          ${text}
        </text>
      </svg>
    `

    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=31536000',
      },
    })
  } catch (error) {
    console.error('Placeholder generation error:', error)
    
    // Return a simple fallback SVG
    const fallbackSvg = `
      <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f0f0f0"/>
        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="16" fill="#666666" text-anchor="middle" dy=".3em">
          Image Error
        </text>
      </svg>
    `

    return new NextResponse(fallbackSvg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=31536000',
      },
    })
  }
}