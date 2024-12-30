'use client'

import { useState } from 'react'
import { ProductCard } from '@/components/ProductCard'
import { MarketplaceHero } from '@/components/MarketplaceHero'
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function MarketplacePage() {
  const [activeTab, setActiveTab] = useState("marketplace")
  
  const products = [
    {
      title: "Corn Crop (Grains)",
      description: "Fresh corn crop, ready to consume",
      hash: "0xasds1kejnmsa18wu",
      farmer: "John Doe",
      amount: "500kg",
      price: "$1000",
      date: "2024-01-15",
      location: {
        lat: 33.5186,
        lng: -86.8104
      }
    },
    // Add more product entries here...
  ]

  const orders = [
    {
      title: "Corn Crop (Grains)",
      description: "Fresh corn crop, ready to consume",
      hash: "0xasds1kejnmsa18wu",
      farmer: "John Doe",
      amount: "500kg",
      price: "$1000",
      date: "2024-01-15",
      location: {
        lat: 33.5186,
        lng: -86.8104
      }
    },
    // Add more order entries here...
  ]
  
  return (
    <div className="min-h-screen bg-gray-50">
      <MarketplaceHero />
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="marketplace" className="w-full mb-8" onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
            <TabsTrigger value="orders">Your Orders</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex justify-end mb-4">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="date-asc">Date: Oldest First</SelectItem>
              <SelectItem value="date-desc">Date: Newest First</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTab === "marketplace"
            ? products.map((product, index) => (
                <ProductCard key={index} {...product} />
              ))
            : orders.map((order, index) => (
                <ProductCard key={index} {...order} />
              ))}
        </div>
      </div>
    </div>
  )
}

