import { Facebook, Twitter, Instagram, Youtube, Mail } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-black text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Image src="/farmlink.png" alt="Farmlink Logo" width={30} height={30} />
              <h3 className="text-xl font-semibold">FarmLink</h3>
            </div>
            <p className="text-gray-400">Driving Agricultural Evolution with Innovation</p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-[#B8FF4F] transition-colors">
                <Facebook size={20} />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-[#B8FF4F] transition-colors">
                <Twitter size={20} />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-[#B8FF4F] transition-colors">
                <Instagram size={20} />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-[#B8FF4F] transition-colors">
                <Youtube size={20} />
              </Link>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/marketplace" className="text-gray-400 hover:text-[#B8FF4F] transition-colors">Marketplace</Link></li>
              <li><Link href="/services" className="text-gray-400 hover:text-[#B8FF4F] transition-colors">Services</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-[#B8FF4F] transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-[#B8FF4F] transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="/terms" className="text-gray-400 hover:text-[#B8FF4F] transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="text-gray-400 hover:text-[#B8FF4F] transition-colors">Privacy Policy</Link></li>
              <li><Link href="/cookies" className="text-gray-400 hover:text-[#B8FF4F] transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
            <p className="text-gray-400 mb-4">Stay updated with our latest news and offers.</p>
            <form className="space-y-2">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
              />
              <Button className="w-full bg-[#B8FF4F] text-black hover:bg-[#99FF00] transition-colors">
                Subscribe
                <Mail className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} FarmLink. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

