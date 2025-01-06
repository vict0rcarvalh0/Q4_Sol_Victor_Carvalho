import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from 'lucide-react'

export function MarketplaceHero() {
  return (
    <div className="bg-gradient-to-r from-[#B8FF4F] to-green-500 text-white py-16 px-4 sm:px-6 lg:px-8 rounded-lg shadow-lg mb-8">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          Welcome to FarmLink Marketplace
        </h1>
        <p className="mt-6 text-xl max-w-2xl mx-auto">
          Discover fresh, locally sourced agricultural products directly from farmers.
        </p>
        <div className="mt-8 max-w-md mx-auto">
          <div className="flex items-center bg-white rounded-full shadow-md">
            <Input
              type="text"
              placeholder="Search for products..."
              className="flex-grow rounded-l-full border-0 focus:ring-0"
            />
            <Button className="rounded-r-full px-6 py-2 bg-green-500 hover:bg-green-600 transition-colors duration-200">
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

