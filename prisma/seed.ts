import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
    },
  })

  // Create regular user
  const userPassword = await bcrypt.hash('user123', 12)
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: 'Regular User',
      password: userPassword,
      role: 'USER',
    },
  })

  console.log('👤 Created users:', { admin: admin.email, user: user.email })

  // Create sample products
  const products = [
    {
      title: 'Classic White T-Shirt',
      description: 'A comfortable and stylish white t-shirt made from 100% cotton. Perfect for everyday wear and casual occasions.',
      price: 1299,
      category: 'MENS' as const,
      published: true,
      buyLink: 'https://example.com/buy/white-tshirt',
      userId: admin.id,
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
            alt: 'Classic White T-Shirt',
            publicId: 'sample-white-tshirt',
            width: 500,
            height: 500,
            format: 'jpg',
            bytes: 25000
          }
        ]
      }
    },
    {
      title: 'Elegant Black Dress',
      description: 'A sophisticated black dress perfect for formal events and special occasions. Features a flattering silhouette and premium fabric.',
      price: 4599,
      category: 'WOMENS' as const,
      published: true,
      buyLink: 'https://example.com/buy/black-dress',
      userId: admin.id,
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500',
            alt: 'Elegant Black Dress',
            publicId: 'sample-black-dress',
            width: 500,
            height: 500,
            format: 'jpg',
            bytes: 30000
          }
        ]
      }
    },
    {
      title: 'Kids Colorful Hoodie',
      description: 'A fun and colorful hoodie designed for kids. Made with soft, comfortable material and vibrant colors that kids love.',
      price: 2199,
      category: 'KIDS' as const,
      published: true,
      buyLink: 'https://example.com/buy/kids-hoodie',
      userId: user.id,
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500',
            alt: 'Kids Colorful Hoodie',
            publicId: 'sample-kids-hoodie',
            width: 500,
            height: 500,
            format: 'jpg',
            bytes: 28000
          }
        ]
      }
    },
    {
      title: 'Denim Jeans',
      description: 'Classic blue denim jeans with a modern fit. Durable and comfortable for all-day wear.',
      price: 2899,
      category: 'MENS' as const,
      published: true,
      buyLink: 'https://example.com/buy/denim-jeans',
      userId: admin.id,
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500',
            alt: 'Denim Jeans',
            publicId: 'sample-denim-jeans',
            width: 500,
            height: 500,
            format: 'jpg',
            bytes: 32000
          }
        ]
      }
    },
    {
      title: 'Summer Floral Top',
      description: 'A beautiful floral top perfect for summer days. Lightweight and breathable fabric with a feminine design.',
      price: 1899,
      category: 'WOMENS' as const,
      published: false, // Draft product
      userId: user.id,
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500',
            alt: 'Summer Floral Top',
            publicId: 'sample-floral-top',
            width: 500,
            height: 500,
            format: 'jpg',
            bytes: 26000
          }
        ]
      }
    },
    {
      title: 'Kids Sports Shoes',
      description: 'Comfortable sports shoes designed for active kids. Features excellent grip and support for running and playing.',
      price: 3299,
      category: 'KIDS' as const,
      published: true,
      buyLink: 'https://example.com/buy/kids-shoes',
      userId: admin.id,
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
            alt: 'Kids Sports Shoes',
            publicId: 'sample-kids-shoes',
            width: 500,
            height: 500,
            format: 'jpg',
            bytes: 35000
          }
        ]
      }
    }
  ]

  for (const product of products) {
    await prisma.product.create({
      data: product,
    })
  }

  console.log('🛍️ Created sample products')

  console.log('✅ Database seed completed!')
  console.log('')
  console.log('🔑 Login credentials:')
  console.log('Admin: admin@example.com / admin123')
  console.log('User: user@example.com / user123')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
