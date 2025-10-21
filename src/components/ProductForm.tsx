'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import ImageUpload from '@/components/ImageUpload'
import { Loader2, Save, Eye } from 'lucide-react'

const productSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().int().min(0, 'Price must be a positive integer'),
  buyLink: z.string().url().optional().or(z.literal('')),
  category: z.enum(['MENS', 'WOMENS', 'KIDS']),
  published: z.boolean().default(false),
})

interface ProductFormProps {
  product?: any
  mode: 'create' | 'edit'
}

interface UploadedImage {
  url: string
  public_id: string
  width: number
  height: number
  format: string
  bytes: number
}

export default function ProductForm({ product, mode }: ProductFormProps) {
  const router = useRouter()
  const [images, setImages] = useState<UploadedImage[]>(
    product?.images?.map((img: any) => ({
      url: img.url,
      public_id: img.publicId || '',
      width: img.width || 0,
      height: img.height || 0,
      format: img.format || '',
      bytes: img.bytes || 0
    })) || []
  )
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: product?.title || '',
      description: product?.description || '',
      price: product?.price || 0,
      buyLink: product?.buyLink || '',
      category: product?.category || 'MENS',
      published: product?.published || false,
    }
  })

  const watchedPublished = watch('published')

  const onSubmit = async (data: any) => {
    setLoading(true)
    try {
      const payload = {
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

      const url = mode === 'create' ? '/api/products' : `/api/products/${product.id}`
      const method = mode === 'create' ? 'POST' : 'PUT'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        const result = await response.json()
        router.push(`/products/${result.id}`)
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to save product')
      }
    } catch (error) {
      console.error('Error saving product:', error)
      alert('Failed to save product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="">
        <CardHeader className="">
          <CardTitle className="">
            {mode === 'create' ? 'Create New Product' : 'Edit Product'}
          </CardTitle>
        </CardHeader>
        <CardContent className="">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Title *
                </label>
                <Input
                  {...register('title')}
                  placeholder="Enter product title"
                  className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{String(errors.title?.message || '')}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (₹) *
                </label>
                <Input
                  type="number"
                  {...register('price', { valueAsNumber: true })}
                  placeholder="Enter price"
                  className={errors.price ? 'border-red-500' : ''}
                />
                {errors.price && (
                  <p className="text-red-500 text-sm mt-1">{String(errors.price?.message || '')}</p>
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
                placeholder="Enter product description"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{String(errors.description?.message || '')}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  {...register('category')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="MENS">Men&apos;s</option>
                  <option value="WOMENS">Women&apos;s</option>
                  <option value="KIDS">Kids</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Buy Link
                </label>
                <Input
                  {...register('buyLink')}
                  placeholder="https://example.com/buy"
                  className={errors.buyLink ? 'border-red-500' : ''}
                />
                {errors.buyLink && (
                  <p className="text-red-500 text-sm mt-1">{String(errors.buyLink?.message || '')}</p>
                )}
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Images *
              </label>
              <ImageUpload
                images={images}
                onImagesChange={setImages}
                maxImages={10}
                disabled={loading}
              />
              {images.length === 0 && (
                <p className="text-red-500 text-sm mt-1">At least one image is required</p>
              )}
            </div>

            {/* Publish Status */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="published"
                {...register('published')}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="published" className="text-sm font-medium text-gray-700">
                Publish this product
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={loading}
                className=""
              >
                Cancel
              </Button>
              
              <div className="flex space-x-3">
                {mode === 'edit' && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push(`/products/${product.id}`)}
                    disabled={loading}
                    className=""
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                )}
                
                <Button
                  type="submit"
                  disabled={loading || images.length === 0}
                  className=""
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {mode === 'create' ? 'Create Product' : 'Update Product'}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
