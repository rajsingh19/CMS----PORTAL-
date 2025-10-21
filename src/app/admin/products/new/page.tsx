'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Navbar from '@/components/Navbar'
import ProductForm from '@/components/ProductForm'

export default function CreateProductPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session || !session.user || session.user.role !== 'ADMIN') {
      router.push('/')
      return
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse mx-auto mb-4" />
            <p className="text-gray-500">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!session || !session.user || session.user.role !== 'ADMIN') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <ProductForm mode="create" />
    </div>
  )
}
