import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Skip API testing during build process
    if (process.env.NODE_ENV === 'production' && !process.env.VERCEL_URL) {
      return NextResponse.json({
        success: true,
        message: 'Gallery seeding API test skipped during build',
        skipped: true
      })
    }
    
    // Test the gallery seeding API endpoint
    const baseUrl = process.env.NEXTAUTH_URL || process.env.VERCEL_URL || 'http://localhost:3000'
    
    const response = await fetch(`${baseUrl}/api/admin/gallery/seed`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      // Add timeout to prevent hanging during build
      signal: AbortSignal.timeout(5000)
    })
    
    // Check if response is JSON
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      const textResponse = await response.text()
      return NextResponse.json({
        success: false,
        message: 'Gallery seeding API returned non-JSON response',
        responseText: textResponse.substring(0, 200) + '...',
        status: response.status
      })
    }
    
    const data = await response.json()
    
    return NextResponse.json({
      success: true,
      message: 'Gallery seeding API test completed',
      apiResponse: data,
      status: response.status
    })
    
  } catch (error) {
    console.error('Gallery seeding API test error:', error)
    
    // Handle specific error types
    let errorMessage = 'Unknown error'
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        errorMessage = 'Request timed out'
      } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
        errorMessage = 'Network error - server may not be running'
      } else {
        errorMessage = error.message
      }
    }
    
    return NextResponse.json({
      success: false,
      message: 'Gallery seeding API test failed',
      error: errorMessage
    }, {
      status: 500
    })
  }
}