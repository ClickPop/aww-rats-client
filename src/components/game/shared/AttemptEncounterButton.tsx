import {
  Box,
  Center,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Tooltip,
} from '@chakra-ui/react';
import React, { useContext, useState } from 'react';
import { GameContext } from '~/components/context/GameContext';
import { Button } from '~/components/game/Button';
import { useAttemptSoloEncounterMutation } from '~/schema/generated';

export const AttemptEncounterButton = () => {
  const { selectedEncounter, selectedRats, player } = useContext(GameContext);
  const hasEnoughEnergy = !!(
    selectedEncounter &&
    player &&
    player.energy >= selectedEncounter.energy_cost
  );
  const atLeastOneRatSelected = selectedRats.filter((r) => !!r).length > 0;
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
  return selectedEncounter ? (
    <>
      <Button
        mx='auto'
        onClick={async () => {
          if (canAttempt) {
            const attemptResult = await attempt({
              variables: {
                encounter_id: selectedEncounter.id,
                rat_ids: selectedRats
                  .filter((rat) => rat?.id)
                  .map((rat) => `${rat?.id}`),
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
        Attempt Encounter
      </Button>
      <Modal
        isCentered
        isOpen={result !== null}
        onClose={() => setResult(null)}>
        <ModalOverlay />
        <ModalContent
          w={{ base: '90%', sm: '75%', md: '30%' }}
          h={{ base: '50%', sm: '40%', md: '30%' }}>
          <ModalCloseButton />
          <ModalBody bgColor={result ? '#B8FFDD' : '#FFA4A4'}>
            <Center h='100%'>
              {result
                ? selectedEncounter.win_text
                : selectedEncounter.loss_text}
            </Center>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  ) : null;
};
