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
import { format } from 'date-fns';
import React, { FC, useMemo, useState } from 'react';
import { GetGameDataQuery } from '~/schema/generated';
import { NormalizedRaid } from '~/types/game';

type Props = {
  data: GetGameDataQuery['raids'];
};

function handleData(key: keyof NormalizedRaid, data: NormalizedRaid) {
  switch (key) {
    case 'start_timestamp':
      return format(new Date(data.start_timestamp), 'MMM d yyyy, hh:mm:ss');
    case 'end_timestamp':
      return format(new Date(data.end_timestamp), 'MMM d yyyy, hh:mm:ss');
    default:
      return `${data[key] ?? 'none'}`;
  }
}

export const RaidsTable: FC<Props> = ({ data }) => {
  const raids = useMemo<NormalizedRaid[]>(
    () =>
      data.map((e) =>
        Object.keys(e)
          .map((k) => k as keyof typeof e)
          .reduce((acc, key) => {
            switch (key as keyof NormalizedRaid) {
              case 'encounter':
                acc['encounter'] = e['encounter'].id;
                break;
              default:
                acc[key as keyof NormalizedRaid] = e[key] as never;
                break;
            }
            return acc;
          }, {} as NormalizedRaid),
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
        <Heading>Raids</Heading>
        <Table>
          <Thead>
            <Tr>
              {Array.from(headers)
                .sort((a) => (a === 'id' ? -1 : 1))
                .map((key) => (
                  <Th key={`raids-${key}`}>{key}</Th>
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
                    <Td key={`raids-${dataKey}`}>
                      <Editable
                        value={`${handleData(
                          dataKey as keyof typeof entry,
                          entry,
                        )}`}>
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
