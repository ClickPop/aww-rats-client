import { Box, Link, VStack, Heading, Text } from '@chakra-ui/react';
import { format } from 'date-fns';
import React, { FC, useContext } from 'react';
import { BacktalkSurveyResultContext } from '~/components/context/BacktalkSurveyResults';

export const SurveyResultsList: FC = () => {
  const {
    surveyResult: { data },
  } = useContext(BacktalkSurveyResultContext);

  return data?.surveys_by_pk?.response_count > 0 ? (
    <>
      <Heading as='h2' mt={6} mb={4} size='md'>
        Individual Responses
      </Heading>
      {(data?.surveys_by_pk?.survey_responses ?? []).map(
        ({ wallet, created_at, question_responses, token_count }) => (
          <Box
            backgroundColor='white'
            border='1px'
            borderColor='gray.200'
            borderRadius={8}
            key={wallet}
            mb={4}
            p={4}>
            <Text mb={4} fontWeight='600'>
              {format(
                new Date(created_at),
                "'📅' eeee, MMMM d, yyyy 'at 🕐' H:mm  (z)",
              )}
            </Text>
            <Text color='gray.500' fontSize='xs' fontWeight='700'>
              Wallet Address:
            </Text>
            <Text mb={4}>
              <Link href={`https://opensea.io/${wallet}`} ml={2} isExternal>
                {wallet}
              </Link>
            </Text>
            <Text color='gray.500' fontSize='xs' fontWeight='700'>
              Tokens Owned:
            </Text>
            {data?.surveys_by_pk?.contracts.map((contract) => (
              <Text mb={3} key={contract.address}>
                {(data?.surveys_by_pk?.contracts?.length ?? 0) > 1
                  ? contract.address + ': '
                  : ''}
                {token_count[contract.address]}
              </Text>
            ))}
            {question_responses &&
              Object.entries(question_responses).map(
                ([question_id, response]) => (
                  <Box key={question_id}>
                    <Heading as='h3' color='gray.500' size='xs' mt={2}>
                      {
                        data?.surveys_by_pk?.questions.find(
                          (q) => `${q.id}` === question_id,
                        )?.prompt
                      }
                    </Heading>
                    <Text key={wallet + response.response}>
                      {response.response}
                    </Text>
                  </Box>
                ),
              )}
          </Box>
        ),
      )}
    </>
  ) : (
    <VStack my={12}>
      <Heading size='lg'>You don&apos;t have any responses yet!</Heading>
      <Text>Share your survey to start getting feedback.</Text>
    </VStack>
  );
};
