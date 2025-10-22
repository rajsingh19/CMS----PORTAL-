'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import ImageUpload from '@/components/ImageUpload'
import { Loader2, X, Package, DollarSign, Tag, Globe, Eye } from 'lucide-react'

const productSchema = z.object({
  title: z.string().min(1, 'Product title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().int().min(1, 'Price must be at least ₹1'),
  originalPrice: z.number().int().min(0).optional(),
  buyLink: z.string().url().optional().or(z.literal('')),
  category: z.enum(['MENS', 'WOMENS', 'KIDS']),
  brand: z.string().min(1, 'Brand is required'),
  stock: z.number().int().min(0, 'Stock cannot be negative'),
  sku: z.string().min(1, 'SKU is required'),
  weight: z.string().optional(),
  dimensions: z.string().optional(),
  color: z.string().optional(),
  size: z.string().optional(),
  material: z.string().optional(),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
})

interface UploadedImage {
  url: string
  public_id: string
  width: number
  height: number
  format: string
  bytes: number
}

interface AdminProductModalProps {
  isOpen: boolean
  onClose: () => void
  onProductAdded: () => void
}

export default function AdminProductModal({ isOpen, onClose, onProductAdded }: AdminProductModalProps) {
  const [images, setImages] = useState<UploadedImage[]>([])
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: '',
      description: '',
      price: 0,
      originalPrice: 0,
      buyLink: '',
      category: 'MENS' as const,
      brand: '',
      stock: 0,
      sku: '',
      weight: '',
      dimensions: '',
      color: '',
      size: '',
      material: '',
      published: false,
      featured: false,
    }
  })

  const onSubmit = async (data: any) => {
    try {
      setLoading(true)
      
      const productData = {
        ...data,
        images: images.map(img => ({
          url: img.url,
          public_id: img.public_id,
          width: img.width,
          height: img.height,
          format: img.format,
          bytes: img.bytes
        }))
      }

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      })

      if (!response.ok) {
        throw new Error('Failed to create product')
      }

      const result = await response.json()
      console.log('Product created successfully:', result)

      // Reset form and close modal
      reset()
      setImages([])
      onClose()
      onProductAdded()
    } catch (error) {
      console.error('Error creating product:', error)
      alert('Failed to create product. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      reset()
      setImages([])
      onClose()
    }
  }

  if (!isOpen) {
    console.log('AdminProductModal: Modal not open')
    return null
  }

  console.log('AdminProductModal: Rendering modal, isOpen:', isOpen)
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[95vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="flex items-center space-x-3">
            <Package className="w-6 h-6" />
            <h2 className="text-xl font-semibold">Add New Product</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            disabled={loading}
            className="text-white hover:bg-white/20"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Basic Information */}
          <Card className="">
            <CardHeader className="">
              <CardTitle className="flex items-center space-x-2">
                <Package className="w-5 h-5" />
                <span>Basic Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Title *
                  </label>
                  <Input
                    {...register('title')}
                    placeholder="Enter product title"
                    className=""
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">{String(errors.title.message)}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Brand *
                  </label>
                  <Input
                    {...register('brand')}
                    placeholder="Enter brand name"
                    className=""
                  />
                  {errors.brand && (
                    <p className="text-red-500 text-sm mt-1">{String(errors.brand.message)}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  {...register('description')}
                  rows={4}
                  placeholder="Enter detailed product description"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{String(errors.description.message)}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SKU *
                  </label>
                  <Input
                    {...register('sku')}
                    placeholder="Enter SKU"
                    className=""
                  />
                  {errors.sku && (
                    <p className="text-red-500 text-sm mt-1">{String(errors.sku.message)}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    {...register('category')}
                    className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="MENS">Men&apos;s</option>
                    <option value="WOMENS">Women&apos;s</option>
                    <option value="KIDS">Kids</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing & Stock */}
          <Card className="">
            <CardHeader className="">
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5" />
                <span>Pricing & Stock</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Price (₹) *
                  </label>
                  <Input
                    {...register('price', { valueAsNumber: true })}
                    type="number"
                    placeholder="Enter current price"
                    className=""
                  />
                  {errors.price && (
                    <p className="text-red-500 text-sm mt-1">{String(errors.price.message)}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Original Price (₹)
                  </label>
                  <Input
                    {...register('originalPrice', { valueAsNumber: true })}
                    type="number"
                    placeholder="Enter original price"
                    className=""
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Quantity *
                  </label>
                  <Input
                    {...register('stock', { valueAsNumber: true })}
                    type="number"
                    placeholder="Enter stock quantity"
                    className=""
                  />
                  {errors.stock && (
                    <p className="text-red-500 text-sm mt-1">{String(errors.stock.message)}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product Details */}
          <Card className="">
            <CardHeader className="">
              <CardTitle className="flex items-center space-x-2">
                <Tag className="w-5 h-5" />
                <span>Product Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color
                  </label>
                  <Input
                    {...register('color')}
                    placeholder="e.g., Red, Blue, Black"
                    className=""
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Size
                  </label>
                  <Input
                    {...register('size')}
                    placeholder="e.g., S, M, L, XL"
                    className=""
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Material
                  </label>
                  <Input
                    {...register('material')}
                    placeholder="e.g., Cotton, Polyester, Leather"
                    className=""
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weight
                  </label>
                  <Input
                    {...register('weight')}
                    placeholder="e.g., 500g, 1kg"
                    className=""
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dimensions
                </label>
                <Input
                  {...register('dimensions')}
                  placeholder="e.g., 10x15x5 cm"
                  className=""
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Buy Link (External)
                </label>
                <Input
                  {...register('buyLink')}
                  placeholder="https://example.com/buy"
                  className=""
                />
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card className="">
            <CardHeader className="">
              <CardTitle className="flex items-center space-x-2">
                <Eye className="w-5 h-5" />
                <span>Product Images</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="">
              <ImageUpload
                images={images}
                onImagesChange={setImages}
                maxImages={8}
                disabled={loading}
              />
            </CardContent>
          </Card>

          {/* Status Options */}
          <Card className="">
            <CardHeader className="">
              <CardTitle>Publishing Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <input
                    {...register('published')}
                    type="checkbox"
                    id="published"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="published" className="text-sm font-medium text-gray-700">
                    Publish immediately
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    {...register('featured')}
                    type="checkbox"
                    id="featured"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                    Featured product
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
              className=""
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Product...
                </>
              ) : (
                <>
                  <Package className="w-4 h-4 mr-2" />
                  Create Product
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
