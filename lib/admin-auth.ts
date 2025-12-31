import { NextRequest, NextResponse } from 'next/server'
import { getSession, getSessionFromRequest } from '@/lib/session'

export async function requireAdmin() {
  const session = await getSession()
  
  if (!session || session.role !== 'ADMIN') {
    throw new Error('Unauthorized')
  }
  
  return session
}

export async function requireAdminFromRequest(request: NextRequest) {
  const session = await getSessionFromRequest(request)
  
  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  return session
}

export function createUnauthorizedResponse() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}