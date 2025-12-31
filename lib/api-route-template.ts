import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'

// MANDATORY: Force dynamic rendering to prevent static evaluation during build
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// Type for route parameters
interface RouteParams {
  params: { id: string }
}

// TEMPLATE: GET handler
export async function GET(
  request: NextRequest,
  context?: RouteParams
) {
  try {
    // 1. Validate parameters if dynamic route
    if (context?.params && !context.params.id) {
      return NextResponse.json({ error: 'Missing required parameter' }, { status: 400 })
    }

    // 2. Authentication check
    await requireAdmin()

    // 3. Your business logic here
    // const result = await prisma.yourModel.findMany()

    // 4. Return response
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API Error:', error)
    
    // Handle authentication errors
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Handle specific Prisma errors
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 })
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// TEMPLATE: POST handler
export async function POST(request: NextRequest) {
  try {
    // 1. Authentication check
    await requireAdmin()

    // 2. Parse and validate request body
    let body
    try {
      body = await request.json()
    } catch (error) {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    // 3. Validate required fields
    if (!body.requiredField) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // 4. Your business logic here
    // const result = await prisma.yourModel.create({ data: body })

    // 5. Return response
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API Error:', error)
    
    // Handle authentication errors
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// TEMPLATE: PUT handler for updates
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // 1. Validate parameters
    if (!params?.id) {
      return NextResponse.json({ error: 'Missing resource ID' }, { status: 400 })
    }

    // 2. Authentication check
    await requireAdmin()

    // 3. Parse and validate request body
    let body
    try {
      body = await request.json()
    } catch (error) {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    // 4. Your business logic here
    // const result = await prisma.yourModel.update({
    //   where: { id: params.id },
    //   data: body
    // })

    // 5. Return response
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API Error:', error)
    
    // Handle authentication errors
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Handle specific Prisma errors
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 })
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// TEMPLATE: DELETE handler
export async function DELETE(
  _request: NextRequest,
  { params }: RouteParams
) {
  try {
    // 1. Validate parameters
    if (!params?.id) {
      return NextResponse.json({ error: 'Missing resource ID' }, { status: 400 })
    }

    // 2. Authentication check
    await requireAdmin()

    // 3. Your business logic here
    // await prisma.yourModel.delete({ where: { id: params.id } })

    // 4. Return response
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API Error:', error)
    
    // Handle authentication errors
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Handle specific Prisma errors
    if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 })
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}