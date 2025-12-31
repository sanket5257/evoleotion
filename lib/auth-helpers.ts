import { NextRequest } from 'next/server'
import { getSession, getSessionFromRequest } from '@/lib/session'

export async function requireAdmin() {
  const session = await getSession()
  
  if (!session || session.role !== 'ADMIN') {
    throw new Error('Unauthorized: Admin access required')
  }
  
  return session
}

export async function requireAdminFromRequest(request: NextRequest) {
  const session = await getSessionFromRequest(request)
  
  if (!session || session.role !== 'ADMIN') {
    throw new Error('Unauthorized: Admin access required')
  }
  
  return session
}

export async function getOptionalSession() {
  try {
    return await getSession()
  } catch {
    return null
  }
}