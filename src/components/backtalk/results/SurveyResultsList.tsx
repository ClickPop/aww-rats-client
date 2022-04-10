import { Box, Heading, Text } from '@chakra-ui/react';
import { format } from 'date-fns';
import React, { FC, useContext } from 'react';
import { BacktalkSurveyResultContext } from '~/components/context/BacktalkSurveyResults';

export const SurveyResultsList: FC = () => {
  const {
    surveyResult: { data },
    processedResponses,
    responseCount,
  } = useContext(BacktalkSurveyResultContext);

  return responseCount > 0 ? (
    <>
      <Heading as='h2' mb={4} size='sm'>
        Individual Responses
      </Heading>
      {Object.entries(processedResponses).map(
        ([wallet, proccessedReponses]) => (
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
                new Date(proccessedReponses.date),
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
            {data?.surveys_by_pk?.questions.map((q) => (
              <Text key={q.id} mt={2}>
                <strong>{q.prompt}:</strong>
                <br />
                {proccessedReponses.responses.map((response) => (
                  <span key={wallet + response}>{response}</span>
                ))}
              </Text>
            ))}
          </Box>
        ),
      )}
    </>
  ) : (
    <Box>No Responses</Box>
  );
};
