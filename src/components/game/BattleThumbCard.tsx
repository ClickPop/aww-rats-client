import React, { FC } from 'react';
import { ThumbCard, ThumbCardProps } from '~/components/game/ThumbCard';
import { Stat } from '~/components/game/Stat';
import { GameIconTypes } from '~/types/game';

interface BattleThumbCardStat {
  icon?: GameIconTypes;
  label?: string;
  value?: string | number;
  showLabel?: boolean;
}

export interface BattleThumbCardProps extends ThumbCardProps {
  stats?: BattleThumbCardStat[]
}

export const BattleThumbCard: FC<BattleThumbCardProps> = ({stats, ...rest}) => {
  return (
    <ThumbCard {...rest}>
      {stats && stats.map(stat => (
        <Stat key={stat.label} {...stat} />
      ))}
    </ThumbCard>
  )
}