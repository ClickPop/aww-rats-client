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
  VStack,
  ButtonGroup,
  HStack,
  Select,
} from '@chakra-ui/react';
import React, { FC, useContext, useState } from 'react';
import { GameAdminContext } from '~/components/context/GameAdminContext';
import { EncounterForm } from '~/components/game/admin/forms/EncounterForm';
import {
  Encounters_Insert_Input,
  Encounter_Resistance_Constraint,
  Encounter_Types_Enum,
  useDeleteEncountersMutation,
} from '~/schema/generated';
import { Encounter_Weakness_Constraint } from '~/schema/generated';
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

const defaultEncounterData = {
  power: 1,
  energy_cost: 1,
  active: false,
  max_rats: 1,
  encounter_type: Encounter_Types_Enum.Solo,
  encounter_resistances: {
    data: [],
  },
  encounter_weaknesses: {
    data: [],
  },
};

export const EncountersTable: FC = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const {
    encounters,
    getTableHeaders,
    refetch,
    encountersPagination,
    setEncountersPagination,
  } = useContext(GameAdminContext);

  const [deleteEncounters] = useDeleteEncountersMutation();

  const handleNewPage = async (page: number) => {
    setEncountersPagination((p) => ({ ...p, page }));
  };

  const [encounter, setEncounter] =
    useState<Encounters_Insert_Input>(defaultEncounterData);

  const handleClose = () => {
    onClose();
    setEncounter(defaultEncounterData);
  };

  return (
    <>
      <Box maxW='100vw' overflow='hidden'>
        <Heading>
          Encounters{' '}
          <Button color='InfoText' onClick={onOpen}>
            New
          </Button>
        </Heading>
        <Box overflow='scroll' maxW='100%' maxH='65vh'>
          <Table>
            <Thead>
              <Tr>
                <Th>Actions</Th>
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
                  <Td>
                    <VStack color='black'>
                      <Button
                        size='xs'
                        onClick={() => {
                          setEncounter({
                            ...{ ...entry, __typename: undefined },
                            gauntlet_encounters: undefined,
                            raids: undefined,
                            encounter_resistances: {
                              data: entry.encounter_resistances.map((e) => ({
                                ...e,
                                __typename: undefined,
                              })),
                              on_conflict: {
                                constraint:
                                  Encounter_Resistance_Constraint.EncounterResistancePkey,
                                update_columns: [],
                              },
                            },
                            encounter_weaknesses: {
                              data: entry.encounter_weaknesses.map((e) => ({
                                ...e,
                                __typename: undefined,
                              })),
                              on_conflict: {
                                constraint:
                                  Encounter_Weakness_Constraint.EncounterWeaknessPkey,
                                update_columns: [],
                              },
                            },
                          });
                          onOpen();
                        }}>
                        edit
                      </Button>
                      <Button
                        size='xs'
                        onClick={async () => {
                          await deleteEncounters({
                            variables: {
                              ids: [entry.id],
                            },
                          });
                          await refetch();
                        }}>
                        delete
                      </Button>
                    </VStack>
                  </Td>
                  {Object.keys(entry)
                    .filter((key) => !key.includes('typename'))
                    .sort((a) => (a === 'id' ? -1 : 1))
                    .map((dataKey) => (
                      <Td key={`encounters-${dataKey}`}>
                        {`${
                          handleData(dataKey as keyof typeof entry, entry) ||
                          '-'
                        }`}
                      </Td>
                    ))}
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
        <HStack>
          <Select
            width='max-content'
            onChange={(e) => {
              const value = e?.currentTarget?.value;
              if (value) {
                setEncountersPagination((p) => ({
                  ...p,
                  pageSize: parseInt(value, 10),
                }));
              }
            }}>
            <option value='5'>5</option>
            <option value='10'>10</option>
            <option value='25'>25</option>
            <option value='50'>50</option>
            <option value='100'>100</option>
          </Select>
          <ButtonGroup>
            {new Array(encountersPagination.totalPages)
              .fill(0)
              .map((_, i) => i + 1)
              .map((p) => (
                <Button color='black' key={p} onClick={() => handleNewPage(p)}>
                  {p}
                </Button>
              ))}
          </ButtonGroup>
        </HStack>
      </Box>
      <Modal isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalBody position='relative'>
            <EncounterForm
              onClose={handleClose}
              encounter={encounter}
              setEncounter={setEncounter}
            />
            <Box as='span' position='absolute' top={0} right={0}>
              <ModalCloseButton />
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
