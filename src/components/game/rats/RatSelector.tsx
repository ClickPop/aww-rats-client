import { Box, Grid, HStack, Text, useDisclosure, Heading } from '@chakra-ui/react';
import React, { useContext, useMemo } from 'react';
import { GameContext } from '~/components/context/GameContext';
import { RatList } from '~/components/game/rats/RatList';
import { TeamCard } from '~/components/game/TeamCard';
import { RattributePill } from '~/components/game/rats/RattributePill';
import { Rattributes_Enum } from '~/schema/generated';
import { RattributeUnion } from '~/types';
import { rattributeToString } from '~/utils/enums';

export const RatSelector = () => {
  const { selectedEncounter, selectedRats, setSelectRatIndex } =
    useContext(GameContext);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const filteredRats = useMemo(
    () => selectedRats.filter((rat) => rat !== null),
    [selectedRats],
  );

  const cuteness = useMemo(
    () => filteredRats.reduce((acc, rat) => (rat?.cuteness ?? 0) + acc, 0),
    [filteredRats],
  );
  const cunning = useMemo(
    () => filteredRats.reduce((acc, rat) => (rat?.cunning ?? 0) + acc, 0),
    [filteredRats],
  );
  const rattitude = useMemo(
    () => filteredRats.reduce((acc, rat) => (rat?.rattitude ?? 0) + acc, 0),
    [filteredRats],
  );

  const weakness = useMemo(
    () =>
      selectedEncounter?.encounter_weaknesses.reduce((acc, w) => {
        switch (w.weakness) {
          case Rattributes_Enum.Cuteness:
            return cuteness + acc;
          case Rattributes_Enum.Cunning:
            return cunning + acc;
          case Rattributes_Enum.Rattitude:
            return rattitude + acc;
          default:
            return acc;
        }
      }, 0) ?? 0,
    [selectedEncounter, cunning, cuteness, rattitude],
  );

  const resistance = useMemo(
    () =>
      selectedEncounter?.encounter_resistances.reduce((acc, r) => {
        switch (r.resistance) {
          case Rattributes_Enum.Cuteness:
            return cuteness + acc;
          case Rattributes_Enum.Cunning:
            return cunning + acc;
          case Rattributes_Enum.Rattitude:
            return rattitude + acc;
          default:
            return acc;
        }
      }, 0) ?? 0,
    [selectedEncounter, cunning, cuteness, rattitude],
  );

  const modifier = weakness - resistance;
  const minRoll = filteredRats.length + modifier;
  const maxRoll = filteredRats.length * 6 + modifier;

  return selectedEncounter ? (
    <>
      <Box
        color='white'
        mt={4}
      >
        <Heading
          as='h3'
          fontWeight='extrabold'
          mb={2}
          size='md'
        >
          Your Team
        </Heading>
        <Text fontSize='sm'>
          <Box mr='0.5rem' as='span' role='img' aria-label='rat-power'>
            💪
          </Box>
          {minRoll} - {maxRoll}
        </Text>
        <HStack my={2}>
          <RattributePill rattribute='cunning' value={cunning} />
          <RattributePill rattribute='cuteness' value={cuteness} />
          <RattributePill rattribute='rattitude' value={rattitude} />
        </HStack>
        <Grid gap={2}
          display='flex'
          flexWrap='wrap'
          mt={4}
        >
          {selectedRats.map((rat, i) => (
            <TeamCard
              key={rat ? rat.id : i}
              rat={
                rat?.image &&
                `/api/image/proxy-image?imageURL=${rat?.image.replace(
                  'ipfs://',
                  'https://ipfs.io/ipfs/',
                )}`
              }
              onClick={() => {
                setSelectRatIndex(i);
                onOpen();
              }}
            />
          ))}
        </Grid>
      </Box>
      <RatList
        drawer={{
          isOpen,
          onClose: () => {
            setSelectRatIndex(null);
            onClose();
          },
        }}
      />
    </>
  ) : null;
};
