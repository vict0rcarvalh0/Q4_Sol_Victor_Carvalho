'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Leaf, ShoppingCart, TrendingUp, Sprout } from 'lucide-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useWallet } from '@solana/wallet-adapter-react'
import { SignUpModal } from '@/components/SignUpModal'
import { Toaster } from '@/components/ui/toaster'

export default function Home() {
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false)
  const { connected } = useWallet()

  useEffect(() => {
    if (connected) {
      setIsSignUpModalOpen(false)
    }
  }, [connected])

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-cover bg-center h-[60vh]" style={{ backgroundImage: "url('/agrofieldcut.png')" }}>
        {/* Header */}
        <header className="relative z-20 flex items-center justify-between p-4">
          <div className="flex items-center space-x-6">
            <Link href="/" className="text-white text-2xl font-bold">FarmLink</Link>
            <Leaf className="w-4 h-4 text-white" />
            <nav className="flex items-center space-x-4">
              <Link href="/services" className="ml-16 mr-4 text-white font-bold hover:text-primary-foreground transition-colors">Services</Link>
              {connected && (
                <>
                  <Link href="/marketplace" className="mr-4 text-white font-bold hover:text-primary-foreground transition-colors">Marketplace</Link>
                  <Link href="/farmer" className="mr-4 text-white font-bold hover:text-primary-foreground transition-colors">Farmer</Link>
                </>
              )}
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <WalletMultiButton style={{}} />
            {!connected && (
              <Button 
                variant="outline" 
                className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:bg-[#EFEFEF] shadow-md bg-white border border-white px-6 py-2 rounded-full text-black font-bold"
                onClick={() => setIsSignUpModalOpen(true)}
              >
                Sign Up
              </Button>
            )}
          </div>
        </header>

        <div className="relative z-10 container mx-auto flex flex-col items-center justify-center h-full text-center text-white space-y-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
            Driving Agricultural Evolution<br />with Innovation
          </h1>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:bg-[#99FF00] duration-300 shadow-md bg-[#B8FF4F] px-6 py-2 rounded-full text-black font-bold">Join Now</button>
            <button className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:bg-[#EFEFEF] shadow-md bg-white border border-white px-6 py-2 rounded-full text-black font-bold">Learn Services</button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 space-y-16">
        {/* Mission Statement */}
        <div className="text-center space-y-2">
          <p className="text-2xl text-muted-foreground">We provide a variety of services that are flexible and tailored to your needs.</p>
          <p className="text-2xl font-semibold">
            We are committed to providing the best experience<br />
            when it comes to agricultural commodities.
          </p>
        </div>

        {/* Benefits Section */}
        <div className="text-center space-y-6 pt-12">
          <h2 className="text-3xl font-semibold">Benefits by using FarmLink</h2>
          <ul className="space-y-4 text-muted-foreground max-w-2xl mx-auto text-left list-inside">
            <li>Farmers can easily tokenize and advertise their crops for sale.</li>
            <li>Consumers can buy directly from farmers, without middlemen, for personal or enterprise needs.</li>
            <li>Investors can easily trade the tokenized assets for hedging or other purposes.</li>
          </ul>
          <button className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:bg-[#99FF00] duration-300 shadow-md bg-[#B8FF4F] px-6 py-2 rounded-full text-black font-bold">Join Now</button>
        </div>

        {/* Services Section */}
        <div className="space-y-6 pt-12">
          <h2 className="text-3xl font-semibold text-center">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6 flex flex-col items-center space-y-4">
                <Image className="rounded-lg object-cover" src="/corn.jpg" alt="Buy Agricultural Commodity" width={300} height={200} />
                <h3 className="text-lg font-medium">Buy Agricultural Commodity</h3>
                <ShoppingCart className="h-6 w-6 text-primary" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex flex-col items-center space-y-4">
                <Image className="rounded-lg object-cover" src="/road.jpg" alt="Sell Agricultural Commodity" width={300} height={200} />
                <h3 className="text-lg font-medium">Sell Agricultural Commodity</h3>
                <TrendingUp className="h-6 w-6 text-primary" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex flex-col items-center justify-center space-y-4 h-full">
                <Sprout className="h-24 w-24 text-primary" />
                <h3 className="text-lg font-medium text-center">Coming Soon</h3>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex flex-col items-center justify-center space-y-4 h-full">
                <Leaf className="h-24 w-24 text-primary" />
                <h3 className="text-lg font-medium text-center">Coming Soon</h3>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <SignUpModal 
        isOpen={isSignUpModalOpen} 
        onClose={() => setIsSignUpModalOpen(false)} 
      />
      <Toaster />
    </div>
  )
}

