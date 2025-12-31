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
    const {
      title,
      description,
      type,
      value,
      maxDiscount,
      couponCode,
      isActive,
      priority,
      startDate,
      endDate,
      minOrderValue,
      applicableStyles,
      firstOrderOnly
    } = body

    // Check if coupon code already exists (excluding current offer)
    if (couponCode) {
      const existingOffer = await prisma.offer.findFirst({
        where: {
          couponCode,
          id: { not: id }
        }
      })

      if (existingOffer) {
        return NextResponse.json({ error: 'Coupon code already exists' }, { status: 400 })
      }
    }

    const offer = await prisma.offer.update({
      where: { id },
      data: {
        title,
        description: description || null,
        type,
        value: parseFloat(value),
        maxDiscount: maxDiscount ? parseFloat(maxDiscount) : null,
        couponCode: couponCode || null,
        isActive,
        priority: parseInt(priority) || 0,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        minOrderValue: minOrderValue ? parseFloat(minOrderValue) : null,
        applicableStyles: applicableStyles || [],
        firstOrderOnly: firstOrderOnly || false
      }
    })

    return NextResponse.json(offer)
  } catch (error) {
    console.error('Error updating offer:', error)
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

    await prisma.offer.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting offer:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}