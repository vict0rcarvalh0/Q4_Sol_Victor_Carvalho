"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ServiceCard } from "@/components/ServiceCard";
import { ShoppingCart, TrendingUp, ArrowRight, Shield, Recycle } from 'lucide-react';
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { SignUpModal } from "@/components/SignUpModal";
import { Toaster } from "@/components/ui/toaster";
import { motion } from "framer-motion";
import { PoweredByMarquee } from "@/components/PoweredByMarquee";
import Image from "next/image";

export default function Home() {
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const { connected } = useWallet();
  const router = useRouter();

  useEffect(() => {
    if (connected) {
      setIsSignUpModalOpen(false);
    }
  }, [connected]);

  const handleJoinNow = () => {
    if (connected) {
      router.push("/marketplace");
    } else {
      setIsSignUpModalOpen(true);
    }
  };

  const handleLearnServices = () => {
    router.push("/services");
  };

  const services = [
    {
      title: "Buy Agricultural Commodity",
      description:
        "Access a wide range of high-quality agricultural products directly from farmers.",
      icon: ShoppingCart,
      comingSoon: false,
    },
    {
      title: "Sell Agricultural Commodity",
      description:
        "Connect with buyers and get the best price for your agricultural products.",
      icon: TrendingUp,
      comingSoon: false,
    },
    {
      title: "Crop Insurance",
      description:
        "Protect your farming investment with our comprehensive crop insurance plans.",
      icon: Shield,
      comingSoon: true,
    },
    {
      title: "Sustainable Farming Practices",
      description:
        "Learn about and implement eco-friendly farming techniques for a better future.",
      icon: Recycle,
      comingSoon: true,
    },
  ];

  // const benefits = [
  //   {
  //     title: "Tokenize Crops",
  //     description:
  //       "Farmers can easily tokenize and advertise their crops for sale, opening up new market opportunities.",
  //     icon: Coins,
  //   },
  //   {
  //     title: "Direct Purchases",
  //     description:
  //       "Consumers can buy directly from farmers, eliminating middlemen for personal or enterprise needs.",
  //     icon: Users,
  //   },
  //   {
  //     title: "Asset Trading",
  //     description:
  //       "Investors can easily trade tokenized assets for hedging or other financial purposes.",
  //     icon: BarChart3,
  //   },
  // ];

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <motion.div
        className="relative bg-cover bg-center h-[60vh]"
        style={{ backgroundImage: "url('/agrofieldcut.png')" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Header */}
        <header className="relative z-20 flex items-center justify-between p-4">
          <div className="flex items-center space-x-6">
            <Link href="/" className="text-white text-2xl font-bold">
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
                className="ml-16 mr-4 text-white font-bold hover:text-primary-foreground transition-colors"
              >
                Services
              </Link>
              {connected && (
                <>
                  <Link
                    href="/marketplace"
                    className="mr-4 text-white font-bold hover:text-primary-foreground transition-colors"
                  >
                    Marketplace
                  </Link>
                  <Link
                    href="/farmer"
                    className="mr-4 text-white font-bold hover:text-primary-foreground transition-colors"
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
                onClick={() => setIsSignUpModalOpen(true)}
              >
                Sign Up
              </Button>
            )}
          </div>
        </header>

        <motion.div
          className="relative z-10 container mx-auto flex flex-col items-center justify-center h-full text-center text-white space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
            Driving Agricultural Evolution
            <br />
            with Innovation
          </h1>
          <div className="flex flex-col sm:flex-row gap-4">
            <motion.button
              onClick={handleJoinNow}
              className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:bg-[#99FF00] duration-300 shadow-md bg-[#B8FF4F] px-6 py-2 rounded-full text-black font-bold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Join Now
            </motion.button>
            <motion.button
              onClick={handleLearnServices}
              className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:bg-[#EFEFEF] shadow-md bg-white border border-white px-6 py-2 rounded-full text-black font-bold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Learn Services
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
      <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, delay: 0.7 }}
>
  <PoweredByMarquee />
</motion.div>
      <div className="container mx-auto px-4 py-16 space-y-16 pb-32">
        {/* Mission Statement */}
        <motion.div
          className="text-center space-y-2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, amount: 0.8 }}
        >
          <p className="text-2xl text-muted-foreground">
            We provide a variety of services that are flexible and tailored to
            your needs.
          </p>
          <p className="text-2xl font-semibold">
            We are committed to providing the best experience
            <br />
            when it comes to agricultural commodities.
          </p>
        </motion.div>
      </div>
      <motion.div
        className="bg-black text-white py-20 w-full"
        initial={{ backgroundColor: "#000000" }}
        whileInView={{ backgroundColor: "#0A0A0A" }}
        transition={{ duration: 1 }}
      >
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-center gap-2">
                <h2 className="text-3xl font-semibold">In FarmLink</h2>
                <Image
                  src="/farmlink.png"
                  alt="Farmlink Logo"
                  width={25}
                  height={25}
                  className="inline-block"
                />
              </div>
              <div className="space-y-6 text-gray-400">
                <p className="text-m">
                  Farmers can easily tokenize and advertise for sale their crops
                </p>
                <p className="text-m">
                  Consumers can easily buy the quantity right from the farmer,
                  without middleman to consume or to their restaurants and
                  enterprises
                </p>
                <p className="text-m">
                  Investor can easily trade the tokenized asset for headging or
                  other purposes
                </p>
              </div>
            </div>
            <div className="text-center lg:text-right space-y-6">
              <h3 className="text-2xl mr-20">
                Are you ready to be part of this?
              </h3>
              <motion.button
                onClick={handleJoinNow}
                className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:bg-[#99FF00] duration-300 shadow-md bg-[#B8FF4F] px-5 py-3 mr-48 rounded-full text-black font-bold text-m"
                whileHover={{ scale: 1.05, backgroundColor: "#99FF00" }}
                whileTap={{ scale: 0.95 }}
              >
                Join Now
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
      <div className="container mx-auto px-4 py-16 space-y-16">
        {/* Services Section */}
        <div className="space-y-10 pt-12">
          <h2 className="text-3xl font-semibold text-center">Our Services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <ServiceCard key={service.title} service={service} index={index} />
            ))}
          </div>
        </div>
      </div>

      <SignUpModal
        isOpen={isSignUpModalOpen}
        onClose={() => setIsSignUpModalOpen(false)}
      />
      <Toaster />
    </div>
  );
}

