import React, { FC } from 'react';
import { Flex, Box, Heading, AspectRatio, Stack, Text } from '@chakra-ui/react';
import { GameIcon } from '~/components/game/Icons';
import { Stat } from '~/components/game/Stat';
import { RatSelector } from '~/components/game/rats/RatSelector';
import { Rattribute, EncounterType, GameIconTypes } from '~/types/game';
import { Image } from '~/components/shared/Image';
import { Encounter_Types_Enum, Rattributes_Enum } from '~/schema/generated';

type Props = {
  className?: string;
  altText?: string;
  image: string | StaticImageData;
  title: string;
  description: string;
  weakness: Rattributes_Enum[];
  resistance: Rattributes_Enum[];
  energy: number | string;
  encounterType: Encounter_Types_Enum;
  strength?: number;
  attack?: number;
  reward?: number | string;
};

export const BattleCard: FC<Props> = ({
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
    <Stack
      direction={['column', 'row']}
      p={4}
      color='white'>
      <AspectRatio
        ratio={1 / 1}
        minW='200px'
        w='200px'
        h='200px'
        rounded='md'
        boxShadow='dark-lg'
        overflow='hidden'
        p={0}
        mr={4}>
        <Image src={image} layout='fill' alt={altText ? altText : title} />
      </AspectRatio>

      <Box>
        <Heading as='h3' size='md' mb={3}>
          {title}
        </Heading>

        <Flex gap={4} mb={2} align='start'>
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

        <Stack
          gap={{ base: 0, md: 4 }}
          mb={2}
          direction={{ base: 'column', md: 'row' }}
          align='start'>
          <Stat label='Weakness' value={weakness.join(', ')} bold />
          <Stat label='Resistance' value={resistance.join(', ')} bold />
        </Stack>

        <Flex gap={4} mb={2}>
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

        <RatSelector />
      </Box>
    </Stack>
  );
};
