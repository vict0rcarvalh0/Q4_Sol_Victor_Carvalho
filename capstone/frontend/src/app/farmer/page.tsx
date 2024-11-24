"use client"

import Image from "next/image"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Leaf, ArrowUpDown, History, X } from 'lucide-react'

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

  return (
    <div className="container mx-auto p-6 space-y-12">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Register an Agricultural Product</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Enter product name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Enter description" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input id="category" placeholder="Category" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit">Unit</Label>
                <Input id="unit" placeholder="Unit" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="totalAmount">Total Amount</Label>
              <Input id="totalAmount" type="number" placeholder="Enter total amount" />
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <Button variant="outline" className="w-full sm:w-auto">
                <Leaf className="w-4 h-4 mr-2" />
                Get Sustainability Certification
              </Button>
              <Button type="submit" className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-105 hover:bg-[#99FF00] duration-300 shadow-md bg-[#B8FF4F] px-28 py-2 rounded-md text-black font-bold">Submit</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Your Products</h2>
        {products.map((product) => (
          <Card key={product.id} className="w-full">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <Image
                  src="/corn.jpg"
                  alt="Product"
                  width={96}
                  height={96}
                  className="rounded-md object-cover"
                />
                <div className="flex-grow space-y-2">
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">{product.description}</p>
                  <p className="text-xs text-muted-foreground">{product.hash}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
                    <p>Total Amount: <span className="font-semibold">{product.totalAmount}</span></p>
                    <p>Available: <span className="font-semibold">{product.availableAmount}</span></p>
                    <p>Profit: <span className="font-semibold">{product.profit}</span></p>
                  </div>
                </div>
                <div className="flex flex-col gap-2 w-full md:w-auto">
                  <Button variant="outline" className="w-full md:w-auto">
                    <History className="w-4 h-4 mr-2" />
                    Transaction History
                  </Button>
                  {product.isClosed ? (
                    <Button variant="secondary" className="w-full md:w-auto" disabled>
                      <X className="w-4 h-4 mr-2" />
                      Closed
                    </Button>
                  ) : (
                    <Button variant="destructive" className="w-full md:w-auto">
                      <ArrowUpDown className="w-4 h-4 mr-2" />
                      Remove from Catalog
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

