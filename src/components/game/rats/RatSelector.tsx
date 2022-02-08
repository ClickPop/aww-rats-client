import { HStack, useDisclosure } from '@chakra-ui/react';
import React, { useContext } from 'react';
import { GameContext } from '~/components/context/GameContext';
import { RatList } from '~/components/game/rats/RatList';
import { TeamCard } from '~/components/game/TeamCard';

export const RatSelector = () => {
  const { selectedEncounter, selectedRats, setSelectRatIndex } =
    useContext(GameContext);
  const { isOpen, onClose, onOpen } = useDisclosure();
  return selectedEncounter ? (
    <>
      <HStack mt={2} justifyContent='center'>
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
      </HStack>
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
