import {
  Flex,
  Heading,
  Spacer,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Button,
  Box,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { compareAsc } from 'date-fns';
import Link from 'next/link';
import React, { useContext, useMemo } from 'react';
import { EthersContext } from '~/components/context/EthersContext';
import { apolloBacktalkClient } from '~/lib/graphql';
import { useGetSurveysByWalletQuery } from '~/schema/generated';

export const Dashboard = () => {
  const { signerAddr } = useContext(EthersContext);

  const { data, error } = useGetSurveysByWalletQuery({
    variables: { wallet: signerAddr! },
    skip: !signerAddr,
    client: apolloBacktalkClient,
  });

  const latestResponseBySurveyId = useMemo(
    () =>
      data?.surveys.reduce<Record<number, Date>>(
        (acc, curr) => ({
          ...acc,
          [curr.id]: curr.questions.reduce<Date>(
            (a, c) =>
              compareAsc(new Date(c.latest_response[0]?.created_at ?? 0), a) < 1
                ? a
                : new Date(c.latest_response[0]?.created_at ?? 0),
            new Date(0),
          ),
        }),
        {},
      ),
    [data?.surveys],
  );

  const responseCountBySurveyId = useMemo(
    () =>
      data?.surveys.reduce<Record<number, number>>(
        (acc, curr) => ({
          ...acc,
          [curr.id]: Math.max(
            ...curr.questions.map(
              (q) => q.responses_aggregate.aggregate?.count ?? 0,
            ),
          ),
        }),
        {},
      ),
    [data?.surveys],
  );

  return (
    <div>
      <Flex align='baseline' my={4}>
        <Heading size='md'>Surveys</Heading>
        <Spacer />
        <Button colorScheme='teal' size='sm' variant='link'>
          Public Surveys
        </Button>
        <Link href='/backtalk/create' passHref>
          <Button colorScheme='teal' ml={2} size='sm'>
            + Survey
          </Button>
        </Link>
      </Flex>

      {data?.surveys && data.surveys.length > 0 ? (
        <TableContainer
          backgroundColor='white'
          border='1px'
          borderColor='gray.200'
          borderRadius={8}>
          <Table variant='simple'>
            <Thead>
              <Tr textTransform='uppercase'>
                <Th>Name</Th>
                <Th>Last Response</Th>
                <Th>Status</Th>
                <Th>Visibility</Th>
                <Th isNumeric>Responses</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.surveys.map((survey) => (
                <Link
                  key={survey.id}
                  passHref
                  href={`/backtalk/results/${survey.id}`}>
                  <Tr
                    cursor='pointer'
                    _hover={{
                      textDecor: 'underline',
                      bgColor: '#FAFAFA',
                      transition: '200ms ease background-color',
                    }}>
                    <Td>{survey.title}</Td>
                    <Td>
                      {latestResponseBySurveyId?.[survey.id].toISOString() ??
                        'None'}
                    </Td>
                    <Td>{survey.is_active ? 'Active' : 'Inactive'}</Td>
                    <Td>{survey.is_public ? 'Public' : 'Private'}</Td>
                    <Td isNumeric>
                      {responseCountBySurveyId?.[survey.id] ?? 0}
                    </Td>
                  </Tr>
                </Link>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      ) : (
        <Box>No surveys</Box>
      )}
    </div>
  );
};
