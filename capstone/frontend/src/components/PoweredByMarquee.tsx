import Image from 'next/image'
import Marquee from 'react-fast-marquee'

export function PoweredByMarquee() {
  return (
    <div className="bg-white py-8">
      <Marquee gradient={false} speed={50}>
        <div className="flex items-center space-x-4 mx-4">
          <span className="text-black font-semibold">Powered by:</span>
          <Image
            src="/solana.png"
            alt="Solana Logo"
            width={100}
            height={30}
            className="inline-block"
          />
        </div>
      </Marquee>
    </div>
  )
}

