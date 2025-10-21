import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/middleware'
import cloudinary from '@/lib/cloudinary'

export async function POST(request: NextRequest) {
  return withAuth(request, async (req, session) => {
    try {
      const formData = await request.formData()
      const file = formData.get('file') as File
      
      if (!file) {
        return NextResponse.json(
          { error: 'No file provided' },
          { status: 400 }
        )
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { error: 'Invalid file type. Only images are allowed.' },
          { status: 400 }
        )
      }

      // Validate file size (10MB max)
      const maxSize = 10 * 1024 * 1024 // 10MB
      if (file.size > maxSize) {
        return NextResponse.json(
          { error: 'File too large. Maximum size is 10MB.' },
          { status: 400 }
        )
      }

      // Convert file to buffer
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Upload to Cloudinary
      const result = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: 'auto',
            folder: 'shopping-platform',
            public_id: `${Date.now()}-${Math.random().toString(36).substring(7)}`,
            transformation: [
              { width: 1200, height: 1200, crop: 'limit', quality: 'auto' },
              { fetch_format: 'auto' }
            ]
          },
          (error, result) => {
            if (error) reject(error)
            else resolve(result)
          }
        ).end(buffer)
      })

      return NextResponse.json({
        success: true,
        image: {
          url: result.secure_url,
          public_id: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format,
          bytes: result.bytes
        }
      })
    } catch (error) {
      console.error('Upload error:', error)
      return NextResponse.json(
        { error: 'Upload failed' },
        { status: 500 }
      )
    }
  })
}

export async function DELETE(request: NextRequest) {
  return withAuth(request, async (req, session) => {
    try {
      const { public_id } = await request.json()
      
      if (!public_id) {
        return NextResponse.json(
          { error: 'No public_id provided' },
          { status: 400 }
        )
      }

      // Delete from Cloudinary
      const result = await cloudinary.uploader.destroy(public_id)
      
      return NextResponse.json({
        success: true,
        result
      })
    } catch (error) {
      console.error('Delete error:', error)
      return NextResponse.json(
        { error: 'Delete failed' },
        { status: 500 }
      )
    }
  })
}
