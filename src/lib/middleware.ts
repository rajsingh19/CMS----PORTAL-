import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function withAuth(
  request: NextRequest,
  handler: (request: NextRequest, session: any) => Promise<NextResponse>
) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return handler(request, session)
}

export async function withAdminAuth(
  request: NextRequest,
  handler: (request: NextRequest, session: any) => Promise<NextResponse>
) {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  return handler(request, session)
}
