import Image from 'next/image'
import Marquee from 'react-fast-marquee'

export function PoweredByMarquee() {
  return (
    <div className="bg-gradient-to-b from-gray-100 to-white shadow-inner py-8">
      <Marquee gradient={false} speed={60}>
        <div className="flex items-center space-x-4 mx-4">
          <div className="pr-12">
            <span className="text-black font-semibold">Powered by</span>
          </div>
          <Image
            src="/solana.png"
            alt="Solana Logo"
            width={60}
            height={30}
            className="inline-block"
          />
        </div>
      </Marquee>
    </div>
  )
}

