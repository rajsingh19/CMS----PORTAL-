'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function ProductCard({ product }: { product: any }) {
  const primaryImage = product.images?.[0]?.url || '/placeholder.png'
  const categoryColors = {
    MENS: 'bg-blue-100 text-blue-800',
    WOMENS: 'bg-pink-100 text-pink-800',
    KIDS: 'bg-green-100 text-green-800',
  }

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={primaryImage}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <Badge 
          className={`absolute top-2 left-2 ${categoryColors[product.category as keyof typeof categoryColors]}`}
        >
          {product.category}
        </Badge>
        {!product.published && (
          <Badge variant="secondary" className="absolute top-2 right-2">Draft</Badge>
        )}
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">
          {product.title}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-3">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900">
            ₹{product.price.toLocaleString()}
          </span>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <div className="flex w-full gap-2">
          <Link href={`/products/${product.id}`} className="flex-1">
            <Button variant="outline" className="w-full">View Details</Button>
          </Link>
          {product.buyLink && (
            <Button asChild className="flex-1">
              <a 
                href={product.buyLink} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Buy Now
              </a>
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
