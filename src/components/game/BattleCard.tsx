import React, { FC } from 'react';
import {
  Flex,
  Grid,
  GridItem,
  Box,
  Heading,
  AspectRatio,
  Text,
} from '@chakra-ui/react';
import { GameIcon } from '~/components/game/Icons';
import { Stat } from '~/components/game/Stat';
import { Rattribute, EncounterType, GameIconTypes } from '~/types/game';
import { Image } from '~/components/shared/Image';

type Props = {
  className?: string;
  altText?: string;
  image: string | StaticImageData;
  title: string;
  description: string;
  weakness: Rattribute;
  resistance: Rattribute;
  energy: number | string;
  encounterType: EncounterType;
  strength?: number;
  attack?: number;
  reward?: number | string;
};

export const BattleCard: FC<Props> = ({
  className,
  altText,
  image,
  title,
  description,
  weakness,
  resistance,
  energy,
  encounterType,
  strength,
  attack,
  reward,
}) => {
  return (
    <Flex rounded='lg' bg='darkAlpha.500' p={4} color='white'>
      <AspectRatio
        ratio={1 / 1}
        w='120px'
        h='120px'
        minW='120px'
        minH='120px'
        rounded='md'
        overflow='hidden'
        p={0}
        mr={4}>
        <Image src={image} objectFit='cover' alt={altText ? altText : title} />
      </AspectRatio>

      <Box>
        <Heading as='h3' size='md'>
          {title}
        </Heading>

        <Flex gap={6} my={2}>
          <Stat
            label='Type'
            value={encounterType}
            bold
            textTransform='capitalize'
          />
          {energy && (
            <Stat
              label='Energy'
              icon={GameIconTypes.Energy}
              value={energy}
              showLabel={false}
              bold
            />
          )}
        </Flex>

        <Flex gap={6} mt={2}>
          <Stat label='Weakness' value={weakness} bold />
          <Stat label='Resistance' value={resistance} bold />
        </Flex>

        <Flex gap={6} mb={2}>
          {strength && (
            <Stat
              label='Strength'
              icon={GameIconTypes.Strength}
              showLabel={false}
              value={strength}
              bold
            />
          )}
          {attack && (
            <Stat
              label='Attack'
              icon={GameIconTypes.Attack}
              showLabel={false}
              value={attack}
              bold
            />
          )}
          {reward && (
            <Stat
              label='Reward'
              icon={GameIconTypes.Reward}
              showLabel={false}
              value={reward}
              bold
            />
          )}
        </Flex>

        {description && (
          <Text as='p' mt={4}>
            {description}
          </Text>
        )}
      </Box>
    </Flex>
  );
};
