"use client";

import Image from 'next/image';
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default function Home() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-cover bg-center h-[60vh]" style={{ backgroundImage: "url('/agrofield.jpg')" }}>
        <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        <WalletMultiButton style={{}} />
        <div className="relative z-10 text-white text-center p-10">
          <p className="text-6xl font-medium mb-4">Driving Agricultural Evolution</p>
          <p className="text-6xl font-medium mb-4">with Innovation</p>
          <div className="flex justify-center gap-4 mt-6">
            <button className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:bg-[#99FF00] duration-300 shadow-md bg-[#B8FF4F] px-6 py-2 rounded-full text-black font-bold">Join Now</button>
            <button className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:bg-[#EFEFEF] shadow-md bg-white border border-white px-6 py-2 rounded-full text-black font-bold">Learn Services</button>
          </div>
        </div>
      </div>

      {/* Trusted Companies */}
      {/* <div className="flex justify-center gap-10 py-8 bg-gray-50">
        <Image src="/general-mills-logo.png" alt="General Mills" width={100} height={50} />
        <Image src="/slc-agricola-logo.png" alt="SLC Agricola" width={100} height={50} />
        <Image src="/cargill-logo.png" alt="Cargill" width={100} height={50} />
      </div> */}

      <div className="py-16 px-4 text-center">
        <p className="text-2xl mb-1 text-[#898989]">We provide a variety of services that are flexible and tailored to your needs.</p>
        <p className="text-2xl font-semibold mb-1 text-black"> We are commited to providing the best experience when it comes to</p>
        <p className="text-2xl font-semibold mb-6 text-black"> agricultural commodities.</p>
      </div>

      {/* Benefits Section */}
      <div className="py-16 px-4 text-center">
        <h2 className="text-4xl font-semibold mb-6 text-[#3F3F3F]">Benefits by using FarmLink</h2>
        <ul className="text-[#898989] space-y-4">
          <li>Farmers can easily tokenize and advertise for sale their crops.</li>
          <li>
            Consumers can easily buy directly from farmers, without middlemen, for personal or enterprise needs.
          </li>
          <li>
            Investors can easily trade the tokenized assets for hedging or other purposes.
          </li>
        </ul>
        <button className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:bg-[#99FF00] duration-300 shadow-md bg-[#B8FF4F] px-6 py-2 rounded-full text-black font-bold mt-10">Join Now</button>
      </div>

      {/* Services Section */}
      <div className="py-16 bg-white">
        <h2 className="text-center text-4xl font-semibold mb-6 text-[#3F3F3F]">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 px-12">
          <div className="rounded-xl p-4 bg-transparent">
            <div className="flex justify-center items-center pt-4">
              <Image className="rounded-xl shadow-md" src="/corn.jpg" alt="Buy Agricultural Commodity" width={300} height={200} />
            </div>
            <h3 className="mt-4 text-lg font-medium text-center text-black">Buy Agricultural Commodity</h3>
          </div>
          <div className="rounded-xl p-4 bg-transparent">
            <div className="flex justify-center items-center pt-4">
              <Image className="rounded-xl shadow-md" src="/road.jpg" alt="Sell Agricultural Commodity" width={300} height={200} />
            </div>
            <h3 className="mt-4 text-lg font-medium text-center text-black">Sell Agricultural Commodity</h3>
          </div>
          <div className="rounded-xl p-4 bg-transparent shadow-md">
            <h3 className="text-lg font-medium text-center opacity-50 text-black">Coming Soon</h3>
          </div>
          <div className="rounded-xl p-4 bg-transparent shadow-md">
            <h3 className="text-lg font-medium text-center opacity-50 text-black">Coming Soon</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
