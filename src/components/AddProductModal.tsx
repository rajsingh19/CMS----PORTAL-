'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import ImageUpload from '@/components/ImageUpload'
import { Loader2, X } from 'lucide-react'

const productSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().int().min(0, 'Price must be a positive integer'),
  buyLink: z.string().url().optional().or(z.literal('')),
  category: z.enum(['MENS', 'WOMENS', 'KIDS']),
  published: z.boolean().default(false),
})

interface UploadedImage {
  url: string
  public_id: string
  width: number
  height: number
  format: string
  bytes: number
}

interface AddProductModalProps {
  isOpen: boolean
  onClose: () => void
  onProductAdded: () => void
}

export default function AddProductModal({ isOpen, onClose, onProductAdded }: AddProductModalProps) {
  const [images, setImages] = useState<UploadedImage[]>([])
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: '',
      description: '',
      price: 0,
      buyLink: '',
      category: 'MENS' as const,
      published: false,
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

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Add New Product</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            disabled={loading}
            className=""
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
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
                Price (₹) *
              </label>
              <Input
                {...register('price', { valueAsNumber: true })}
                type="number"
                placeholder="Enter price"
                className=""
              />
              {errors.price && (
                <p className="text-red-500 text-sm mt-1">{String(errors.price.message)}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              {...register('description')}
              rows={3}
              placeholder="Enter product description"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{String(errors.description.message)}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buy Link (Optional)
              </label>
              <Input
                {...register('buyLink')}
                placeholder="https://example.com"
                className=""
              />
            </div>
          </div>

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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Images
            </label>
            <ImageUpload
              images={images}
              onImagesChange={setImages}
              maxImages={5}
              disabled={loading}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
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
              className=""
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Product'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
