import {
  Flex,
  Heading,
  UnorderedList,
  ListItem,
  Spacer,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Text,
  Button,
  Box,
  Center,
  useToast,
} from '@chakra-ui/react';
import { format, isEqual } from 'date-fns';
import { Link } from 'common/components/shared/Link';
import React, { useEffect, useMemo } from 'react';
import { useGetSurveysByWalletQuery } from '~/schema/generated';
import { useAccount } from 'wagmi';

export const Dashboard = () => {
  const { data: account } = useAccount();

  const signerAddr = account?.address;

  const { data, loading, error } = useGetSurveysByWalletQuery({
    variables: { wallet: signerAddr! },
    skip: !signerAddr,
  });

  const toast = useToast();

  useEffect(() => {
    if (!loading && error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
      });
    }
  }, [error, loading, toast]);

  const latestResponseBySurveyId = useMemo(
    () =>
      data?.surveys.reduce<Record<number, Date | undefined>>(
        (acc, curr) => ({
          ...acc,
          [curr.id]: curr.latest_response
            ? new Date(curr.latest_response)
            : undefined,
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
          [curr.id]: curr.response_count ?? 0,
        }),
        {},
      ),
    [data?.surveys],
  );

  if (loading) {
    return <Center>Loading...</Center>;
  }

  return (
    <div>
      <Flex align='baseline' my={4}>
        <Heading size='lg'>Surveys</Heading>
        <Spacer />
        <Link href='/create'>
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
                <Th isNumeric>Responses</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.surveys.map((survey) => (
                <Tr key={survey.id}>
                  <Td>
                    <Link href={`/results/${survey.id}`}>
                      <Text isTruncated maxW={64}>
                        {survey.title}
                      </Text>
                    </Link>
                  </Td>
                  <Td>
                    {latestResponseBySurveyId?.[survey.id]
                      ? format(
                          latestResponseBySurveyId[survey.id] as Date,
                          "MM/dd/yy '-' H:mm",
                        )
                      : 'None'}
                  </Td>
                  <Td>{survey.is_active ? 'Active' : 'Inactive'}</Td>
                  <Td isNumeric>{responseCountBySurveyId?.[survey.id] ?? 0}</Td>
                  <Td>
                    <Link href={`/results/${survey.id}`}>📈</Link>{' '}
                    <Link href={`/survey/${survey.id}`} openInNewTab>
                      🔗
                    </Link>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      ) : (
        <Box fontSize='lg'>
          <Heading size='xl' mt={6} mb={4}>
            Hey there!
          </Heading>
          <Text mb={2}>
            You don&apos;t have any surveys yet. Make a survey to:
          </Text>
          <UnorderedList ml={8}>
            <ListItem>Build a pre-sale list.</ListItem>
            <ListItem>
              Run a community ballot initiative to make a decision for your
              project.
            </ListItem>
            <ListItem>Get to know your audience.</ListItem>
          </UnorderedList>
        </Box>
      )}
    </div>
  );
};
