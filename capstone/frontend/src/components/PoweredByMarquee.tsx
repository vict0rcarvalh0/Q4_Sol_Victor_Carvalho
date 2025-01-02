import Image from 'next/image'
import Marquee from 'react-fast-marquee'

export function PoweredByMarquee() {
  return (
    <div className="bg-white py-8">
      <Marquee gradient={false} speed={50}>
        <div className="flex items-center space-x-4 mx-4">
          <div className="pr-28">
            <span className="text-black font-semibold">Powered by</span>
          </div>
          <Image
            src="/solana.png"
            alt="Solana Logo"
            width={70}
            height={30}
            className="inline-block"
          />
        </div>
      </Marquee>
    </div>
  )
}

