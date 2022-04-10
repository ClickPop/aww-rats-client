import { Box, Heading, Text } from '@chakra-ui/react';
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
      <Heading as='h2' mb={4} size='sm'>
        Individual Responses
      </Heading>
      {(data?.surveys_by_pk?.survey_responses ?? []).map(
        ({ wallet, created_at, response_values, question_ids }) => (
          <Box
            backgroundColor='white'
            border='1px'
            borderColor='gray.200'
            borderRadius={8}
            key={wallet}
            mb={4}
            p={4}>
            <Heading as='h3' color='gray.500' mb={4} size='xs'>
              {format(
                new Date(created_at),
                "'📅' eeee, MMMM d, yyyy 'at 🕐' H:mm  (z)",
              )}
            </Heading>
            <Heading as='h3' color='gray.500' size='xs'>
              Wallet Address:
            </Heading>
            <Text mb={3}>
              {wallet}
            </Text>
            {data?.surveys_by_pk?.questions.map((q) =>
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
            )}
          </Box>
        ),
      )}
    </>
  ) : (
    <Box>No Responses</Box>
  );
};
