import {
  Box,
  Heading,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Editable,
  EditableInput,
  EditablePreview,
} from '@chakra-ui/react';
import React, { FC, useMemo, useState } from 'react';
import { GetGameDataQuery } from '~/schema/generated';
import { NormalizedGauntlet } from '~/types/game';

type Props = {
  data: GetGameDataQuery['gauntlets'];
};

function handleData(key: keyof NormalizedGauntlet, data: NormalizedGauntlet) {
  return `${data[key] ?? 'none'}`;
}

export const GauntletsTable: FC<Props> = ({ data }) => {
  const raids = useMemo<NormalizedGauntlet[]>(
    () =>
      data.map((e) =>
        Object.keys(e)
          .map((k) => k as keyof typeof e)
          .reduce((acc, key) => {
            switch (key as keyof NormalizedGauntlet) {
              case 'gauntlet_encounters':
                acc['gauntlet_encounters'] = e['gauntlet_encounters'].map(
                  (e) => e.encounter.id,
                );
                break;
              default:
                acc[key as keyof NormalizedGauntlet] = e[key] as never;
                break;
            }
            return acc;
          }, {} as NormalizedGauntlet),
      ),
    [data],
  );
  const headers = data.reduce((acc, curr) => {
    Object.keys(curr)
      .filter((curr) => !curr.includes('typename'))
      .forEach((k) => {
        acc.add(k);
      });
    return acc;
  }, new Set<string>());
  return (
    <>
      <Box maxW='100%' overflow='scroll'>
        <Heading>Encounters</Heading>
        <Table>
          <Thead>
            <Tr>
              {Array.from(headers)
                .sort((a) => (a === 'id' ? -1 : 1))
                .map((key) => (
                  <Th key={`encounters-${key}`}>{key}</Th>
                ))}
            </Tr>
          </Thead>
          <Tbody>
            {raids.map((entry) => (
              <Tr key={entry.id}>
                {Object.keys(entry)
                  .filter((key) => !key.includes('typename'))
                  .sort((a) => (a === 'id' ? -1 : 1))
                  .map((dataKey) => (
                    <Td key={`encounters-${dataKey}`}>
                      <Editable
                        id={`encounters-${dataKey}`}
                        value={`${
                          handleData(dataKey as keyof typeof entry, entry) ??
                          ' '
                        }`}>
                        <EditableInput />
                        <EditablePreview />
                      </Editable>
                    </Td>
                  ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </>
  );
};
