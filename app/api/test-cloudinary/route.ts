import { NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function GET() {
  try {
    // Test Cloudinary configuration
    const config = {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: !!process.env.CLOUDINARY_API_SECRET, // Don't expose the secret
    }

    // Try to get account details (this will fail if config is wrong)
    const result = await cloudinary.api.ping()

    return NextResponse.json({
      success: true,
      config,
      cloudinary_status: result,
      message: 'Cloudinary is configured correctly'
    })
  } catch (error) {
    console.error('Cloudinary test error:', error)
    return NextResponse.json({
      success: false,
      config: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: !!process.env.CLOUDINARY_API_SECRET,
      },
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Cloudinary configuration failed'
    }, { status: 500 })
  }
}