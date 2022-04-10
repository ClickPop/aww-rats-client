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
            <Heading as='h3' color='gray.500' mb={2} size='xs'>
              {format(
                new Date(created_at),
                "'📅' eeee, MMMM d, yyyy 'at 🕐' H:mm  (z)",
              )}
            </Heading>
            <Text mb={3}>
              <strong>
                Wallet Address:
                <br />
              </strong>{' '}
              {wallet}
            </Text>
            {data?.surveys_by_pk?.questions.map((q) =>
              (question_ids as number[])?.findIndex((qid) => qid === q.id) >
              -1 ? (
                <Text key={q.id} mt={2}>
                  <strong>{q.prompt}:</strong>
                  <br />
                  <span
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
                  </span>
                </Text>
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
