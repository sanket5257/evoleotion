import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    const body = await request.json()
    const { style, size, numberOfFaces, basePrice, isActive } = body

    const pricing = await prisma.pricing.update({
      where: { id },
      data: {
        style,
        size,
        numberOfFaces: parseInt(numberOfFaces),
        basePrice: parseFloat(basePrice),
        isActive
      }
    })

    return NextResponse.json(pricing)
  } catch (error) {
    console.error('Error updating pricing:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    await prisma.pricing.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting pricing:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}