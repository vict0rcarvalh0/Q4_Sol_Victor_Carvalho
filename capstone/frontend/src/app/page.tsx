import Image from 'next/image';

export default function Home() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-cover bg-center h-[60vh]" style={{ backgroundImage: "url('/path-to-your-image.jpg')" }}>
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative z-10 text-white text-center p-10">
          <h1 className="text-4xl font-bold mb-4">Driving Agricultural Evolution with Innovation</h1>
          <div className="flex justify-center gap-4 mt-6">
            <button className="bg-green-500 px-6 py-2 rounded-full text-white font-medium">Join Now</button>
            <button className="bg-transparent border border-white px-6 py-2 rounded-full text-white font-medium">Learn Services</button>
          </div>
        </div>
      </div>

      {/* Trusted Companies */}
      <div className="flex justify-center gap-10 py-8 bg-gray-50">
        <Image src="/general-mills-logo.png" alt="General Mills" width={100} height={50} />
        <Image src="/slc-agricola-logo.png" alt="SLC Agricola" width={100} height={50} />
        <Image src="/cargill-logo.png" alt="Cargill" width={100} height={50} />
      </div>

      {/* Benefits Section */}
      <div className="py-16 px-4 text-center">
        <h2 className="text-2xl font-semibold mb-6">Benefits by using FarmLink</h2>
        <ul className="text-gray-700 space-y-4">
          <li>Farmers can easily tokenize and advertise for sale their crops.</li>
          <li>
            Consumers can easily buy directly from farmers, without middlemen, for personal or enterprise needs.
          </li>
          <li>
            Investors can easily trade the tokenized assets for hedging or other purposes.
          </li>
        </ul>
        <button className="mt-6 bg-green-500 text-white px-6 py-2 rounded-full">Join Now</button>
      </div>

      {/* Services Section */}
      <div className="py-16 bg-gray-100">
        <h2 className="text-center text-2xl font-semibold mb-10">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-8">
          <div className="border p-4 bg-white shadow-sm">
            <Image src="/buy-agriculture.jpg" alt="Buy Agricultural Commodity" width={300} height={200} />
            <h3 className="mt-4 text-lg font-medium text-center">Buy Agricultural Commodity</h3>
          </div>
          <div className="border p-4 bg-white shadow-sm">
            <Image src="/sell-agriculture.jpg" alt="Sell Agricultural Commodity" width={300} height={200} />
            <h3 className="mt-4 text-lg font-medium text-center">Sell Agricultural Commodity</h3>
          </div>
          <div className="border p-4 bg-white shadow-sm">
            <h3 className="text-lg font-medium text-center opacity-50">Coming Soon</h3>
          </div>
          <div className="border p-4 bg-white shadow-sm">
            <h3 className="text-lg font-medium text-center opacity-50">Coming Soon</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
