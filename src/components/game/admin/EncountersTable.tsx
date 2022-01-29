import {
  Box,
  Heading,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import React, { FC, useContext } from 'react';
import { GameAdminContext } from '~/components/context/GameAdminContext';
import { NewEncounter } from '~/components/game/admin/forms/NewEncounter';
import { NormalizedEncounter } from '~/types/game';

function handleData(key: keyof NormalizedEncounter, data: NormalizedEncounter) {
  switch (key) {
    case 'encounter_resistances':
      return data.encounter_resistances?.length
        ? data.encounter_resistances.map((r) => r.resistance).join(', ')
        : '';
    case 'encounter_weaknesses':
      return data.encounter_weaknesses?.length
        ? data.encounter_weaknesses.map((r) => r.weakness).join(', ')
        : '';
    default:
      return `${data[key] ?? ''}`;
  }
}

export const EncountersTable: FC = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { encounters, getTableHeaders } = useContext(GameAdminContext);

  return (
    <>
      <Box maxW='100%' overflow='scroll'>
        <Heading>
          Encounters{' '}
          <Button color='InfoText' onClick={onOpen}>
            New
          </Button>
        </Heading>
        <Table>
          <Thead>
            <Tr>
              {Array.from(
                getTableHeaders<NormalizedEncounter[]>(encounters ?? []),
              )
                .sort((a) => (a === 'id' ? -1 : 1))
                .map((key) => (
                  <Th key={`encounters-${key}`}>{key}</Th>
                ))}
            </Tr>
          </Thead>
          <Tbody>
            {encounters.map((entry) => (
              <Tr key={entry.id}>
                {Object.keys(entry)
                  .filter((key) => !key.includes('typename'))
                  .sort((a) => (a === 'id' ? -1 : 1))
                  .map((dataKey) => (
                    <Td key={`encounters-${dataKey}`}>
                      {`${
                        handleData(dataKey as keyof typeof entry, entry) || '-'
                      }`}
                    </Td>
                  ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalBody position='relative'>
            <NewEncounter onClose={onClose} />
            <Box as='span' position='absolute' top={0} right={0}>
              <ModalCloseButton />
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
