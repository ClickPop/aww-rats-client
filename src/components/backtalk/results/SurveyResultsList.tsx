import { Box, VStack, Heading, Text } from '@chakra-ui/react';
import { format } from 'date-fns';
import React, { FC, useContext } from 'react';
import { BacktalkSurveyResultContext } from '~/components/context/BacktalkSurveyResults';

export const SurveyResultsList: FC = () => {
  const {
    surveyResult: { data },
  } = useContext(BacktalkSurveyResultContext);

  console.log(data);

  return data?.surveys_by_pk?.response_count > 0 ? (
    <>
      <Heading as='h2' my={4} size='md'>
        Individual Responses
      </Heading>
      {(data?.surveys_by_pk?.survey_responses ?? []).map(
        ({
          wallet,
          created_at,
          response_values,
          question_ids,
          token_count,
        }) => (
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
            <Text mb={4}>{wallet}</Text>
            {data?.surveys_by_pk?.contract && (
              <>
                <Text color='gray.500' fontSize='xs' fontWeight='700'>
                  Tokens Owned:
                </Text>
                <Text mb={3}>{token_count}</Text>
              </>
            )}
            {response_values.map((response: string, i: number) => (
              <>
                <Text
                  color='gray.500'
                  fontSize='xs'
                  fontWeight='700'
                  key={question_ids[i]}
                  mt={2}>
                  {
                    data?.surveys_by_pk?.questions.find(
                      (q) => q.id === question_ids[i],
                    )?.prompt
                  }
                </Text>
                <Text key={wallet + response} mb={4}>{response}</Text>
              </>
            ))}
            {/* {data?.surveys_by_pk?.questions.map((q) =>
              (question_ids as number[])?.findIndex((qid) => qid === q.id) >
              -1 ? (
                <>
                  <Heading as='h3' color='gray.500' size='xs' key={q.id} mt={2}>
                    {q.prompt}
                  </Heading>
                  <Text
                    key={
                      wallet +
                      response_values[
                        (question_ids as number[])?.findIndex(
                          (qid) => qid === q.id,
                        )
                      ]
                    }>
                    {
                      response_values[
                        (question_ids as number[])?.findIndex(
                          (qid) => qid === q.id,
                        )
                      ]
                    }
                  </Text>
                </>
              ) : null,
            )} */}
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
