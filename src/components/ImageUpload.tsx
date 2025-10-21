'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { X, Upload, Image as ImageIcon } from 'lucide-react'

interface UploadedImage {
  url: string
  public_id: string
  width: number
  height: number
  format: string
  bytes: number
}

interface ImageUploadProps {
  images: UploadedImage[]
  onImagesChange: (images: UploadedImage[]) => void
  maxImages?: number
  disabled?: boolean
}

export default function ImageUpload({ 
  images, 
  onImagesChange, 
  maxImages = 10, 
  disabled = false 
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (disabled) return
    
    const remainingSlots = maxImages - images.length
    const filesToUpload = acceptedFiles.slice(0, remainingSlots)
    
    if (filesToUpload.length === 0) {
      alert(`Maximum ${maxImages} images allowed`)
      return
    }

    setUploading(true)
    setUploadProgress(0)

    try {
      const uploadPromises = filesToUpload.map(async (file, index) => {
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          throw new Error('Upload failed')
        }

        const result = await response.json()
        setUploadProgress(((index + 1) / filesToUpload.length) * 100)
        
        return result.image
      })

      const uploadedImages = await Promise.all(uploadPromises)
      onImagesChange([...images, ...uploadedImages])
    } catch (error) {
      console.error('Upload error:', error)
      alert('Upload failed. Please try again.')
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }, [images, onImagesChange, maxImages, disabled])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled: disabled || uploading || images.length >= maxImages
  })

  const removeImage = async (publicId: string) => {
    if (disabled) return
    
    try {
      const response = await fetch('/api/upload', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ public_id: publicId }),
      })

      if (response.ok) {
        onImagesChange(images.filter(img => img.public_id !== publicId))
      } else {
        alert('Failed to delete image')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Failed to delete image')
    }
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <Card 
        {...getRootProps()} 
        className={`cursor-pointer transition-colors ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-dashed'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <CardContent className="p-6">
          <input {...getInputProps()} />
          <div className="text-center">
            {uploading ? (
              <div className="space-y-2">
                <Upload className="w-8 h-8 mx-auto text-blue-500 animate-pulse" />
                <p className="text-sm text-gray-600">Uploading...</p>
                <Progress value={uploadProgress} className="w-full" />
              </div>
            ) : (
              <div className="space-y-2">
                <ImageIcon className="w-8 h-8 mx-auto text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {isDragActive ? 'Drop images here' : 'Drag & drop images here'}
                  </p>
                  <p className="text-xs text-gray-500">
                    or click to select files
                  </p>
                </div>
                <p className="text-xs text-gray-400">
                  PNG, JPG, WEBP, GIF up to 10MB
                </p>
                <p className="text-xs text-gray-400">
                  {images.length}/{maxImages} images
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={image.public_id} className="relative group">
              <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100">
                <Image
                  src={image.url}
                  alt={`Upload ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                />
                {!disabled && (
                  <button
                    onClick={() => removeImage(image.public_id)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
              <div className="mt-1 text-xs text-gray-500 truncate">
                {image.format.toUpperCase()} • {(image.bytes / 1024).toFixed(0)}KB
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
