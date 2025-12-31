import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic' // Force dynamic route handling

export async function GET(request: Request, { params }: { params: { id: string } }) {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}
