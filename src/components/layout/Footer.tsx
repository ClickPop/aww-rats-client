import React from 'react'
import { Image } from '~/components/shared/Image'
import ratBenetar from '~/assets/images/rat-benetar.png';
import ratSajak from '~/assets/images/rat-sajak.png';
import raBoi from '~/assets/images/rat-boi.png';
import ratrickStewart from '~/assets/images/ratrick-stewart.png';

export const Footer = () => {
  return (
    <div className="bg-light">
      <div className="flex mx-auto space-x-4 pt-16 max-w-5xl px-12">
        <Image className="h-56 w-full rounded-t-full overflow-hidden" src={ratBenetar} alt="Rat Benetar" layout="fill" objectFit="cover" placeholder="blur" />
        <Image className="h-56 w-full rounded-t-full overflow-hidden" src={raBoi} alt="Rat Boi" layout="fill" objectFit="cover" placeholder="blur"/>
        <Image className="h-56 w-full rounded-t-full overflow-hidden" src={ratSajak} alt="Rat Sajak" layout="fill" objectFit="cover" placeholder="blur" />
        <Image className="h-56 w-full rounded-t-full overflow-hidden" src={ratrickStewart} alt="Ratrick Stewart" layout="fill" objectFit="cover" placeholder="blur" />
      </div>
    </div>
  )
}
