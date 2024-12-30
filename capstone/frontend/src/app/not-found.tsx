'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Leaf, ArrowLeft, Home } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function NotFound() {
  const router = useRouter()
  const [countdown, setCountdown] = useState(20)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          router.push('/')
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-green-50 to-green-100 text-foreground p-4">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center p-6 text-center">
          <Leaf className="w-16 h-16 text-primary mb-4 animate-pulse" />
          <h1 className="text-4xl font-bold mb-2">Oops!</h1>
          <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
          <p className="text-lg mb-6">
            We are cultivating something amazing, but this page is not ready for harvest yet.
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            Redirecting you to the homepage in {countdown} seconds...
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => router.back()}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
            <Button
              variant="default"
              className="flex-1"
              onClick={() => router.push('/')}
            >
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

