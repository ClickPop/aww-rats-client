import {
  Box,
  Center,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  ModalHeader,
} from '@chakra-ui/react';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { GameContext } from '~/components/context/GameContext';
import { Button } from '~/components/game/Button';
import { useAttemptSoloEncounterMutation } from '~/schema/generated';
import { Image } from '~/components/shared/Image';
import SuccessImage from '~/assets/images/ratrace/ratrace-success.webp';
import FailImage from '~/assets/images/ratrace/ratrace-fail.webp';
import JSConfetti from 'js-confetti';

// The button to start an encounter is set from this list of potential labels when someone selects an encounter.
const buttonLabels = [
  'Chaaaarge',
  "Let's go",
  'Let it rip',
  'Go for it',
  'Go',
  'Get it',
];

export const AttemptEncounterButton = () => {
  const { selectedEncounter, ratSlots, player } = useContext(GameContext);
  const hasEnoughEnergy = !!(
    selectedEncounter &&
    player &&
    player.energy >= selectedEncounter.energy_cost
  );

  const buttonLabel = useMemo(
    () => buttonLabels[Math.floor(Math.random() * buttonLabels.length)],
    // We want this to change whenever we select a new encounter, just silencing this warning.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedEncounter],
  );

  const jsConfetti = useMemo(() => new JSConfetti(), []);

  const atLeastOneRatSelected = ratSlots.filter((r) => !!r).length > 0;
  const canAttempt = hasEnoughEnergy && atLeastOneRatSelected;
  const [attempt, { loading }] = useAttemptSoloEncounterMutation();
  const [result, setResult] = useState<boolean | null>(null);
  const getToolTipText = () => {
    if (!atLeastOneRatSelected) {
      return 'Must select at least one rat';
    }
    if (!hasEnoughEnergy) {
      return 'Not Enough Energy';
    }
    return '';
  };

  useEffect(() => {
    if (result) {
      jsConfetti.addConfetti({ emojis: ['🐀', '🧀'] });
    }
  }, [result, jsConfetti]);

  return selectedEncounter ? (
    <>
      <Button
        background='linear-gradient(-45deg, var(--chakra-colors-pink-500), var(--chakra-colors-red-500), var(--chakra-colors-blue-500), var(--chakra-colors-purple-500))'
        backgroundSize='600% 400%'
        borderRadius='none'
        display='block'
        pt={6}
        pb={10}
        w='100%'
        _hover={{
          animation: 'encounterShimmer 4s ease infinite;',
        }}
        onClick={async () => {
          if (canAttempt) {
            const attemptResult = await attempt({
              variables: {
                encounter_id: selectedEncounter.id,
                rat_ids: ratSlots
                  .filter((slot) => slot.rat?.id)
                  .map((slot) => `${slot.rat?.id}`),
              },
            });
            if (attemptResult.data?.attempt_solo_encounter) {
              setResult(attemptResult.data.attempt_solo_encounter.result);
            }
          }
        }}
        disabled={!canAttempt}
        isLoading={loading}
        tooltip={{
          isDisabled: canAttempt,
          label: getToolTipText(),
        }}>
        {buttonLabel} 🎲
      </Button>

      <Modal
        isCentered
        isOpen={result !== null}
        size='xl'
        onClose={() => setResult(null)}>
        <ModalOverlay backdropFilter='blur(4px)' />
        <ModalContent
          bgColor={result ? 'green.50' : 'red.50'}
          color='gray.900'
          fontWeight='semibold'
          rounded='2xl'
          overflow='hidden'>
          <ModalCloseButton zIndex='5' />

          <ModalHeader p={0} m={0}>
            <Image
              src={result ? SuccessImage : FailImage}
              alt='You won... or lost!'
            />
          </ModalHeader>

          <ModalBody pb={4}>
            {result ? selectedEncounter.win_text : selectedEncounter.loss_text}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  ) : null;
};
