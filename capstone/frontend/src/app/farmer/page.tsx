"use client"

import Image from "next/image"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Leaf, ArrowUpDown, History, X, Truck, Sprout, DollarSign, Package } from 'lucide-react'
import { DeliverModal } from "@/components/DeliverModal"
import { Badge } from "@/components/ui/badge"

export default function Home() {
  const [products] = useState([
    {
      id: 1,
      name: "Corn Crop (Grains)",
      description: "Fresh corn crop, ready to consume",
      hash: "0xasdkljeinasdl8wu",
      totalAmount: "500kg",
      availableAmount: "300kg",
      profit: "$200",
      isClosed: false,
    },
    {
      id: 2,
      name: "Corn Crop (Grains)",
      description: "Fresh corn crop, ready to consume",
      hash: "0xasdkljeinasdl8wu",
      totalAmount: "500kg",
      availableAmount: "300kg",
      profit: "$200",
      isClosed: true,
    },
  ])

  const [deliverModalOpen, setDeliverModalOpen] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null)

  const handleDeliverClick = (productId: number) => {
    setSelectedProductId(productId)
    setDeliverModalOpen(true)
  }

  return (
    <div className="container mx-auto p-6 space-y-12">
      <Card className="w-full max-w-3xl mx-auto shadow-lg">
        <CardHeader className="bg-white text-black">
          <CardTitle className="text-3xl font-bold">Register an Agricultural Product</CardTitle>
          <CardDescription className="text-gray-800">Add your new product to the marketplace</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-lg">Product Name</Label>
              <Input id="name" placeholder="Enter product name" className="text-lg" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-lg">Description</Label>
              <Textarea id="description" placeholder="Enter description" className="text-lg" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-lg">Category</Label>
                <Input id="category" placeholder="Category" className="text-lg" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit" className="text-lg">Unit</Label>
                <Input id="unit" placeholder="Unit" className="text-lg" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="totalAmount" className="text-lg">Total Amount</Label>
              <Input id="totalAmount" type="number" placeholder="Enter total amount" className="text-lg" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pricePerUnit" className="text-lg">Price Per Unit</Label>
              <Input id="pricePerUnit" type="number" placeholder="Enter price per unit" className="text-lg" />
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <Button variant="outline" className="w-full sm:w-auto text-lg" disabled>
                <Leaf className="w-5 h-5 mr-2" />
                Get Sustainability Certification
              </Button>
              <Button type="submit" className="w-full sm:w-auto text-lg transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-105 hover:bg-[#99FF00] duration-300 shadow-md bg-[#B8FF4F] px-8 py-3 rounded-md text-black font-bold">
                <Sprout className="w-5 h-5 mr-2" />
                Submit Product
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center mb-8">Your Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="w-full shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <Image
                      src="/corn.jpg"
                      alt="Product"
                      width={80}
                      height={80}
                      className="rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-xl font-semibold">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">{product.description}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center">
                      <Package className="w-4 h-4 mr-2 text-blue-500" />
                      <p>Total: <span className="font-semibold">{product.totalAmount}</span></p>
                    </div>
                    <div className="flex items-center">
                      <Package className="w-4 h-4 mr-2 text-green-500" />
                      <p>Available: <span className="font-semibold">{product.availableAmount}</span></p>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-2 text-yellow-500" />
                      <p>Profit: <span className="font-semibold">{product.profit}</span></p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground break-all">{product.hash}</p>
                  <div className="flex flex-wrap gap-2">
                    {product.isClosed ? (
                      <>
                        <Button variant="outline" size="sm" className="flex-grow">
                          <History className="w-4 h-4 mr-2" />
                          Transaction History
                        </Button>
                        <Badge variant="secondary" className="px-2 py-1">
                          <X className="w-4 h-4 mr-2" />
                          Closed
                        </Badge>
                      </>
                    ) : (
                      <>
                        <Button variant="outline" size="sm" className="flex-1">
                          <History className="w-4 h-4 mr-2" />
                          Transaction History
                        </Button>
                        <Button variant="destructive" size="sm" className="flex-1">
                          <ArrowUpDown className="w-4 h-4 mr-2" />
                          Remove from Catalog
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => handleDeliverClick(product.id)}>
                          <Truck className="w-4 h-4 mr-2" />
                          Deliver
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <DeliverModal
        isOpen={deliverModalOpen}
        onClose={() => setDeliverModalOpen(false)}
        productId={selectedProductId || 0}
      />
    </div>
  )
}
