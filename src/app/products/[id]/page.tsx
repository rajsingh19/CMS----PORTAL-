'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Navbar from '@/components/Navbar'
import { getProduct } from '@/lib/api'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export default function ProductDetailPage() {
  const params = useParams()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true)
      const data = await getProduct(params.id)
      setProduct(data)
    } catch (error) {
      console.error('Error fetching product:', error)
    } finally {
      setLoading(false)
    }
  }, [params.id])

  useEffect(() => {
    if (params.id) {
      fetchProduct()
    }
  }, [params.id, fetchProduct])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="aspect-square bg-gray-200 rounded" />
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4" />
                <div className="h-6 bg-gray-200 rounded w-1/2" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
            <p className="text-gray-600 mb-6">The product you&apos;re looking for doesn&apos;t exist.</p>
            <Link href="/products">
              <Button className="">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Products
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const primaryImage = product.images?.[selectedImageIndex]?.url || '/placeholder.png'
  const categoryColors = {
    MENS: 'bg-blue-100 text-blue-800',
    WOMENS: 'bg-pink-100 text-pink-800',
    KIDS: 'bg-green-100 text-green-800',
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/products">
            <Button variant="outline" className="">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square relative overflow-hidden rounded-lg bg-white">
              <Image
                src={primaryImage}
                alt={product.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image: any, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square relative overflow-hidden rounded-lg ${
                      selectedImageIndex === index ? 'ring-2 ring-blue-500' : ''
                    }`}
                  >
                    <Image
                      src={image.url}
                      alt={`${product.title} ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 25vw, 12.5vw"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Badge className={categoryColors[product.category as keyof typeof categoryColors]}>
                  {product.category}
                </Badge>
                {!product.published && (
                  <Badge variant="secondary" className="">Draft</Badge>
                )}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.title}
              </h1>
              <div className="text-3xl font-bold text-gray-900 mb-6">
                ₹{product.price.toLocaleString()}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {product.description}
              </p>
            </div>

            {product.buyLink && (
              <div className="pt-6">
                <Button asChild size="lg" className="w-full">
                  <a 
                    href={product.buyLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Buy Now
                  </a>
                </Button>
              </div>
            )}

            <div className="pt-6 border-t">
              <div className="text-sm text-gray-500">
                <p>Added by: {product.user?.name || 'Unknown'}</p>
                <p>Created: {new Date(product.createdAt).toLocaleDateString()}</p>
                {product.updatedAt !== product.createdAt && (
                  <p>Updated: {new Date(product.updatedAt).toLocaleDateString()}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
