import React from 'react'
import { Image } from '~/components/shared/Image'

export const Footer = () => {
  return (
    <div className="bg-light">
      <div className="flex mx-auto space-x-4 pt-16 max-w-5xl px-12">
        <Image className="h-56 w-full rounded-t-full overflow-hidden" src="/rat-benetar.png" alt="Rat Benetar" layout="fill" objectFit="cover" />
        <Image className="h-56 w-full rounded-t-full overflow-hidden" src="/rat-boi.png" alt="Rat Benetar" layout="fill" objectFit="cover" />
        <Image className="h-56 w-full rounded-t-full overflow-hidden" src="/rat-sajak.png" alt="Rat Benetar" layout="fill" objectFit="cover" />
        <Image className="h-56 w-full rounded-t-full overflow-hidden" src="/ratrick-stewart.png" alt="Rat Benetar" layout="fill" objectFit="cover" />
      </div>
    </div>
  )
}
