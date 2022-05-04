import React, { FC } from 'react';
import { ThumbCard, ThumbCardProps } from '~/components/game/ThumbCard';
import { Stat } from '~/components/game/Stat';
import { RatTypeStat } from '~/components/game/RatTypeStat';
import { RatType } from '~/types/game';
import { Rat_Types_Enum } from '~/schema/generated';

export interface RatThumbCardProps extends ThumbCardProps {
  ratType: Rat_Types_Enum;
  showRatTypeIcon?: boolean;
  cunning?: number;
  cuteness?: number;
  rattitude?: number;
}

export const RatThumbCard: FC<RatThumbCardProps> = ({
  ratType,
  showRatTypeIcon,
  cunning,
  cuteness,
  rattitude,
  ...rest
}) => {
  return (
    <ThumbCard {...rest}>
      <RatTypeStat ratType={ratType} showIcon={showRatTypeIcon} />
      {cunning ? <Stat label='Cunning' value={cunning} /> : null}
      {cuteness ? <Stat label='Cuteness' value={cuteness} /> : null}
      {rattitude ? <Stat label='Rattitude' value={rattitude} /> : null}
    </ThumbCard>
  );
};
