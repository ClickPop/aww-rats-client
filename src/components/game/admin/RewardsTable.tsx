import {
  Box,
  Heading,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  useDisclosure,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
} from '@chakra-ui/react';
import React, { useContext } from 'react';
import { GameAdminContext } from '~/components/context/GameAdminContext';
import { NewEncounter } from '~/components/game/admin/forms/NewEncounter';
import { NewReward } from '~/components/game/admin/forms/NewReward';
import { GetGameDataQuery } from '~/schema/generated';

export const RewardsTable = () => {
  const { rewards, refetch, getTableHeaders } = useContext(GameAdminContext);
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <>
      <Box maxW='100%' overflow='scroll'>
        <Heading>
          Rewards{' '}
          <Button color='InfoText' onClick={onOpen}>
            New
          </Button>
        </Heading>
        <Table>
          <Thead>
            <Tr>
              {Array.from(getTableHeaders<GetGameDataQuery['rewards']>(rewards))
                .sort((a) => (a === 'id' ? -1 : 1))
                .map((key) => (
                  <Th key={`encounters-${key}`}>{key}</Th>
                ))}
            </Tr>
          </Thead>
          <Tbody>
            {rewards.map((entry) => (
              <Tr key={entry.id}>
                {Object.keys(entry)
                  .filter((key) => !key.includes('typename'))
                  .sort((a) => (a === 'id' ? -1 : 1))
                  .map((dataKey) => (
                    <Td key={`encounters-${dataKey}`}>
                      {`${entry[dataKey as keyof typeof entry] || '-'}`}
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
            <NewReward onClose={onClose} />
            <Box as='span' position='absolute' top={0} right={0}>
              <ModalCloseButton />
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
