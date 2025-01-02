"use client";

import { useRouter } from "next/navigation";
import { ServiceCard } from "@/components/ServiceCard";
import { ShoppingCart, TrendingUp, Shield, Recycle } from 'lucide-react';
import { useWallet } from "@solana/wallet-adapter-react";
import { Toaster } from "@/components/ui/toaster";
import { motion } from "framer-motion";
import { PoweredByMarquee } from "@/components/PoweredByMarquee";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function Home() {
  const { connected } = useWallet();
  const router = useRouter();

  const handleJoinNow = () => {
    if (connected) {
      router.push("/marketplace");
    } else {
      router.push("/signup");
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

  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <motion.div
        className="relative bg-cover bg-center h-[60vh]"
        style={{ backgroundImage: "url('/agrofieldcut.png')" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
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
              <ServiceCard
                key={service.title}
                service={service}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>

      <Footer />
      <Toaster />
    </div>
  );
}

