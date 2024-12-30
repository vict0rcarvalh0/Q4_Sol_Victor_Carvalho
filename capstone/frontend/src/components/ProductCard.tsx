'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar, ShoppingCart } from 'lucide-react'

interface ProductCardProps {
  title: string
  description: string
  hash: string
  farmer: string
  amount: string
  price: string
  date: string
  location: {
    lat: number
    lng: number
  }
}

export function ProductCard({
  title,
  description,
//   hash,
  farmer,
  amount,
  price,
  date,
  location
}: ProductCardProps) {
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${location.lat},${location.lng}`

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-lg">
      <CardContent className="p-0">
        <div className="aspect-video relative">
          <iframe
            width="100%"
            height="100%"
            frameBorder="0"
            style={{ border: 0 }}
            src={mapUrl}
            allowFullScreen
          ></iframe>
          <Badge className="absolute top-2 right-2 bg-green-500">{amount}</Badge>
        </div>
        <div className="p-4 space-y-2">
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{farmer}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-1" />
            <span>{date}</span>
          </div>
          <div className="flex justify-between items-center mt-4">
            <span className="text-2xl font-bold">{price}</span>
            <Button className="bg-green-500 hover:bg-green-600">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Buy Now
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

