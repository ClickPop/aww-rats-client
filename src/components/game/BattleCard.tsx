import React, { FC } from 'react';
import { EnergyIcon } from '~/components/game/Icons';
import { Rattribute, EncounterType } from '~/types/game';
import { Button } from '~/components/game/Button';
import { Image } from '~/components/shared/Image';

type Props = {
    className?: string;
    altText?: string;
    imgPath: string | StaticImageData;
    title: string;
    description: string;
    weakness: Rattribute;
    resistance: Rattribute;
    energy: number;
    encounterType: EncounterType;
};

export const BattleCard: FC<Props> = ({
    className,
    altText,
    imgPath,
    title,
    description,
    weakness,
    resistance,
    energy,
    encounterType
}) => {
    return (
        <div className={`grid grid-cols-12 ${className}`}>
            <div className='col-span-3 md:col-span-2 rounded-md overflow-hidden'>
                <Image
                    src={imgPath}
                    alt={altText}
                    className='leading-none'
                    layout='responsive'
                />
            </div>
            <div className='col-span-9 md:col-span-10 py-2 px-6'>
                <h1 className='text-2xl font-bold mb-4'>
                    {title}
                </h1>
                
                <div className='mb-4'>
                    Type: {encounterType}
                </div>

                <div className='mb-4'>
                    <EnergyIcon /> {energy}
                </div>

                <div className='mb-4'>
                    <div>
                        Weakness: {weakness}
                    </div>
                    <div>
                        Resistance: {resistance}
                    </div>
                </div>

                <div>{description}</div>
            </div>
        </div>
    );
};