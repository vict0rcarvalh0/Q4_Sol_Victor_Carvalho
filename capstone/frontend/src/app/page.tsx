"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShoppingCart, TrendingUp, ArrowRight, Shield, Recycle, Coins, Users, BarChart3 } from 'lucide-react';
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

  const benefits = [
    {
      title: "Tokenize Crops",
      description:
        "Farmers can easily tokenize and advertise their crops for sale, opening up new market opportunities.",
      icon: Coins,
    },
    {
      title: "Direct Purchases",
      description:
        "Consumers can buy directly from farmers, eliminating middlemen for personal or enterprise needs.",
      icon: Users,
    },
    {
      title: "Asset Trading",
      description:
        "Investors can easily trade tokenized assets for hedging or other financial purposes.",
      icon: BarChart3,
    },
  ];

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <div
        className="relative bg-cover bg-center h-[60vh]"
        style={{ backgroundImage: "url('/agrofieldcut.png')" }}
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

        <div className="relative z-10 container mx-auto flex flex-col items-center justify-center h-full text-center text-white space-y-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
            Driving Agricultural Evolution
            <br />
            with Innovation
          </h1>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleJoinNow}
              className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:bg-[#99FF00] duration-300 shadow-md bg-[#B8FF4F] px-6 py-2 rounded-full text-black font-bold"
            >
              Join Now
            </button>
            <button
              onClick={handleLearnServices}
              className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:bg-[#EFEFEF] shadow-md bg-white border border-white px-6 py-2 rounded-full text-black font-bold"
            >
              Learn Services
            </button>
          </div>
        </div>
      </div>
      <PoweredByMarquee />
      <div className="container mx-auto px-4 py-16 space-y-16 pb-32">
        {/* Mission Statement */}
        <div className="text-center space-y-2">
          <p className="text-2xl text-muted-foreground">
            We provide a variety of services that are flexible and tailored to
            your needs.
          </p>
          <p className="text-2xl font-semibold">
            We are committed to providing the best experience
            <br />
            when it comes to agricultural commodities.
          </p>
        </div>
      </div>
      <div className="bg-black text-white py-20 w-full">
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
              <Button
                onClick={handleJoinNow}
                className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:bg-[#99FF00] duration-300 shadow-md bg-[#B8FF4F] px-5 py-3 mr-44 rounded-full text-black font-bold text-lg"
              >
                Join Now <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-16 space-y-16">
        {/* Benefits Section */}
        <div className="space-y-10 pt-12">
          <h2 className="text-3xl font-semibold text-center">
            Benefits of Using FarmLink
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full bg-primary/5 border-none transition-all duration-300 ease-in-out hover:bg-primary/10">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                      <benefit.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-foreground/80">
                      {benefit.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          <div className="flex justify-center">
            <Button
              onClick={handleJoinNow}
              className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:bg-[#99FF00] duration-300 shadow-md bg-[#B8FF4F] px-8 py-3 rounded-full text-black font-bold text-lg"
            >
              Join Now
            </Button>
          </div>
        </div>

        {/* Services Section */}
        <div className="space-y-10 pt-12">
          <h2 className="text-3xl font-semibold text-center">Our Services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full transition-all duration-300 ease-in-out hover:shadow-[0_0_20px_rgba(184,255,79,0.5)] hover:ring-1 hover:ring-[#B8FF4F] hover:ring-offset-0 relative after:absolute after:inset-0 after:rounded-lg after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-300 after:shadow-[0_0_30px_4px_rgba(184,255,79,0.3)] after:pointer-events-none">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-full bg-[#B8FF4F] flex items-center justify-center mb-4">
                      <service.icon className="h-6 w-6 text-black" />
                    </div>
                    <CardTitle className="text-lg">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{service.description}</CardDescription>
                  </CardContent>
                  <CardFooter>
                    {service.comingSoon ? (
                      <span className="text-sm text-muted-foreground">
                        Coming Soon
                      </span>
                    ) : (
                      <Button variant="ghost" className="w-full group">
                        Learn More
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </motion.div>
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

