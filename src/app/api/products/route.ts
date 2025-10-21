import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const productSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().int().min(0, 'Price must be a positive integer'),
  buyLink: z.string().url().optional().or(z.literal('')),
  category: z.enum(['MENS', 'WOMENS', 'KIDS']),
  published: z.boolean().default(false),
  images: z.array(z.object({
    url: z.string().url(),
    public_id: z.string(),
    width: z.number(),
    height: z.number(),
    format: z.string(),
    bytes: z.number()
  })).optional(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '25'), 100)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const published = searchParams.get('published')

    const skip = (page - 1) * limit

    const where: any = {}
    
    if (category && ['MENS', 'WOMENS', 'KIDS'].includes(category)) {
      where.category = category
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    if (published !== null) {
      where.published = published === 'true'
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          images: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.product.count({ where })
    ])

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      }
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = productSchema.parse(body)

    // Get user from session (you'll need to implement this)
    const userId = 'temp-user-id' // Replace with actual user ID from session

    const product = await prisma.product.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        price: validatedData.price,
        buyLink: validatedData.buyLink,
        category: validatedData.category,
        published: validatedData.published,
        userId,
        images: validatedData.images ? {
          create: validatedData.images.map(img => ({
            url: img.url,
            alt: validatedData.title,
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

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
