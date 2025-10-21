'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function Navbar() {
  const { data: session, status } = useSession()

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              Shopping Platform
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/products">
              <Button variant="ghost" className="">Products</Button>
            </Link>
            
            {session?.user?.role === 'ADMIN' && (
              <Link href="/admin">
                <Button variant="ghost" className="">Admin</Button>
              </Link>
            )}

            {status === 'loading' ? (
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
            ) : session ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-700">
                  {session.user.name || session.user.email}
                </span>
                <Button onClick={() => signOut()} variant="outline" size="sm" className="">
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button onClick={() => signIn()} variant="outline" size="sm" className="">
                  Sign In
                </Button>
                <Link href="/auth/signup">
                  <Button size="sm" className="">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
