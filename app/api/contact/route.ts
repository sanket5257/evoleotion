import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    // Extract form fields
    const contactData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      portraitType: formData.get('portraitType') as string,
      size: formData.get('size') as string,
      numberOfPeople: formData.get('numberOfPeople') as string,
      budget: formData.get('budget') as string,
      timeline: formData.get('timeline') as string,
      message: formData.get('message') as string,
      referencePhotos: formData.get('referencePhotos') as string,
      submittedAt: new Date().toISOString()
    }

    // Validate required fields
    if (!contactData.name || !contactData.email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(contactData.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Handle image uploads
    const uploadedImages: string[] = []
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'contact')
    
    try {
      await mkdir(uploadDir, { recursive: true })
    } catch (error) {
      // Directory might already exist
    }

    // Process uploaded images
    for (let i = 0; i < 5; i++) {
      const imageFile = formData.get(`image-${i}`) as File
      if (imageFile && imageFile.size > 0) {
        const bytes = await imageFile.arrayBuffer()
        const buffer = Buffer.from(bytes)
        
        // Generate unique filename
        const timestamp = Date.now()
        const filename = `${timestamp}-${i}-${imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
        const filepath = join(uploadDir, filename)
        
        await writeFile(filepath, buffer)
        uploadedImages.push(`/uploads/contact/${filename}`)
      }
    }

    // In a real application, you would:
    // 1. Save to database
    // 2. Send email notification to admin
    // 3. Send confirmation email to customer
    // 4. Integrate with CRM system
    
    // For now, we'll log the submission and return success
    console.log('Contact form submission:', {
      ...contactData,
      uploadedImages,
      imageCount: uploadedImages.length
    })

    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    return NextResponse.json({
      success: true,
      message: 'Your message has been sent successfully!',
      submissionId: `contact_${Date.now()}`,
      imageCount: uploadedImages.length
    })

  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500 }
    )
  }
}