import React, { FC } from 'react';
import { ThumbCard, ThumbCardProps } from '~/components/game/ThumbCard';
import { Stat } from '~/components/game/Stat';
import { RatTypeStat } from '~/components/game/RatTypeStat';
import { RatType } from '~/types/game';

export interface RatThumbCardProps extends ThumbCardProps {
  ratType: RatType;
  showRatTypeIcon?: boolean;
  cunning?: number;
  cuteness?: number;
  rattitude?: number;
}

export const RatThumbCard: FC<RatThumbCardProps> = ({ratType, showRatTypeIcon, cunning, cuteness, rattitude, ...rest}) => {
  return (
    <ThumbCard {...rest}>
      <RatTypeStat ratType={ratType} showIcon={showRatTypeIcon} />
      {cunning && <Stat label='Cunning' value={cunning} />}
      {cuteness && <Stat label='Cuteness' value={cuteness} />}
      {rattitude && <Stat label='Rattitude' value={rattitude} />}
    </ThumbCard>
  )
}