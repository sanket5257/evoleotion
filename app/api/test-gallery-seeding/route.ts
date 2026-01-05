import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Test the gallery seeding API endpoint
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    
    const response = await fetch(`${baseUrl}/api/admin/gallery/seed`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    const data = await response.json()
    
    return NextResponse.json({
      success: true,
      message: 'Gallery seeding API test completed',
      apiResponse: data,
      status: response.status
    })
    
  } catch (error) {
    console.error('Gallery seeding API test error:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Gallery seeding API test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, {
      status: 500
    })
  }
}