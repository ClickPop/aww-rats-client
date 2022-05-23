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
import { hashids } from '~/utils/hash-ids';
import { SurveyList } from '~/components/backtalk/SurveyList';

export const Dashboard = () => {
  const { data: account } = useAccount();

  const signerAddr = account?.address;

  const { data, loading, error } = useGetSurveysByWalletQuery({
    variables: { wallet: signerAddr! },
    skip: !signerAddr,
    fetchPolicy: 'network-only',
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

  if (loading) {
    return <Center>Loading...</Center>;
  }

  return (
    <>
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
        <SurveyList surveys={data.surveys} showActions />
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
    </>
  );
};
