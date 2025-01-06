"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import Image from "next/image";
import { SignUpModal } from "@/components/SignUpModal";
import { getFarmerByWalletAddress } from "@/services/farmer";
import { toast } from "@/hooks/use-toast";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const { connected, publicKey, disconnect } = useWallet();
  const { setVisible } = useWalletModal();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const checkWalletInDatabase = useCallback(async (walletAddress: string) => {
    try {
      await getFarmerByWalletAddress(walletAddress);
      return true; // Wallet exists in the database
    } catch (error) {
      console.log(error);
      return false; // Wallet doesn't exist in the database
    }
  }, []);

  useEffect(() => {
    const validateWallet = async () => {
      if (connected && publicKey && !isSigningUp) {
        const walletExists = await checkWalletInDatabase(publicKey.toBase58());
        if (!walletExists) {
          toast({
            title: "Wallet not found",
            description: "Wallet not found, please Sign Up.",
            variant: "destructive",
          });
          disconnect();
        }
      }
    };

    validateWallet();
  }, [connected, publicKey, checkWalletInDatabase, disconnect, isSigningUp]);

  const handleWalletButtonClick = useCallback(async () => {
    if (connected) {
      disconnect();
    } else {
      setVisible(true);
    }
  }, [connected, disconnect, setVisible]);

  const handleSignUpClick = () => {
    setIsSigningUp(true);
    setIsSignUpModalOpen(true);
  };

  const handleSignUpModalClose = () => {
    setIsSignUpModalOpen(false);
    setIsSigningUp(false);
  };

  return (
    <>
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
            <Button
              onClick={handleWalletButtonClick}
              className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:bg-[#EFEFEF] shadow-md bg-white border border-white px-6 py-2 rounded-full text-black font-bold"
            >
              {connected ? 'Disconnect Wallet' : 'Connect Wallet'}
            </Button>
            {!connected && (
              <Button
                variant="outline"
                className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:bg-[#EFEFEF] shadow-md bg-white border border-white px-6 py-2 rounded-full text-black font-bold"
                onClick={handleSignUpClick}
              >
                Sign Up
              </Button>
            )}
          </div>
        </div>
      </header>
      <SignUpModal
        isOpen={isSignUpModalOpen}
        onClose={handleSignUpModalClose}
      />
    </>
  );
}

