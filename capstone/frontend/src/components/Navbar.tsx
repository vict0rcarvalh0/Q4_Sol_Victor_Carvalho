"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import Image from "next/image";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { connected } = useWallet();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-background/80 backdrop-blur-md' : 'bg-transparent'}`}>
      <div className="container mx-auto flex items-center justify-between p-4">
        <div className="flex items-center space-x-6">
          <Link href="/" className={`text-2xl font-bold ${isScrolled ? 'text-foreground' : 'text-white'}`}>
            FarmLink
          </Link>
          <Image
            src="/farmlink.png"
            alt="Farmlink Logo"
            width={25}
            height={25}
            className="inline-block"
          />
          <nav className="flex items-center space-x-4">
            <Link
              href="/services"
              className={`ml-16 mr-4 font-bold hover:text-primary-foreground transition-colors ${isScrolled ? 'text-foreground' : 'text-white'}`}
            >
              Services
            </Link>
            {connected && (
              <>
                <Link
                  href="/marketplace"
                  className={`mr-4 font-bold hover:text-primary-foreground transition-colors ${isScrolled ? 'text-foreground' : 'text-white'}`}
                >
                  Marketplace
                </Link>
                <Link
                  href="/farmer"
                  className={`mr-4 font-bold hover:text-primary-foreground transition-colors ${isScrolled ? 'text-foreground' : 'text-white'}`}
                >
                  Farmer
                </Link>
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
              onClick={() => router.push("/signup")}
            >
              Sign Up
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

