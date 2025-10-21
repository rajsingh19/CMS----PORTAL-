import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { withAuth } from '@/lib/middleware'

const productUpdateSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  description: z.string().min(1, 'Description is required').optional(),
  price: z.number().int().min(0, 'Price must be a positive integer').optional(),
  buyLink: z.string().url().optional().or(z.literal('')),
  category: z.enum(['MENS', 'WOMENS', 'KIDS']).optional(),
  published: z.boolean().optional(),
  images: z.array(z.object({
    url: z.string().url(),
    public_id: z.string(),
    width: z.number(),
    height: z.number(),
    format: z.string(),
    bytes: z.number()
  })).optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        images: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(request, async (req, session) => {
    try {
      const { id } = await params
      const body = await request.json()
      const validatedData = productUpdateSchema.parse(body)

      // Check if product exists
      const existingProduct = await prisma.product.findUnique({
        where: { id },
        include: { images: true }
      })

      if (!existingProduct) {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        )
      }

      // Check if user owns the product or is admin
      if (existingProduct.userId !== session.user.id && session.user.role !== 'ADMIN') {
        return NextResponse.json(
          { error: 'Forbidden' },
          { status: 403 }
        )
      }

      // Update product
      const product = await prisma.product.update({
        where: { id },
        data: {
          title: validatedData.title,
          description: validatedData.description,
          price: validatedData.price,
          buyLink: validatedData.buyLink,
          category: validatedData.category,
          published: validatedData.published,
          images: validatedData.images ? {
            deleteMany: {},
            create: validatedData.images.map(img => ({
              url: img.url,
              alt: validatedData.title || existingProduct.title,
              publicId: img.public_id,
              width: img.width,
              height: img.height,
              format: img.format,
              bytes: img.bytes
            }))
          } : undefined,
        },
        include: {
          images: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            }
          }
        }
      })

      return NextResponse.json(product)
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: 'Validation error', details: error.errors },
          { status: 400 }
        )
      }

      console.error('Error updating product:', error)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(request, async (req, session) => {
    try {
      const { id } = await params
      
      // Check if product exists
      const existingProduct = await prisma.product.findUnique({
        where: { id }
      })

      if (!existingProduct) {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        )
      }

      // Check if user owns the product or is admin
      if (existingProduct.userId !== session.user.id && session.user.role !== 'ADMIN') {
        return NextResponse.json(
          { error: 'Forbidden' },
          { status: 403 }
        )
      }

      // Delete product (images will be deleted due to cascade)
      await prisma.product.delete({
        where: { id }
      })

      return NextResponse.json(
        { message: 'Product deleted successfully' },
        { status: 200 }
      )
    } catch (error) {
      console.error('Error deleting product:', error)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  })
}
