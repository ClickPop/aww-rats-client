import { Box, Button, Center, Heading, Text } from '@chakra-ui/react';
import React, { FC, useContext } from 'react';
import { Connect } from '~/components/backtalk/Connect';
import { SurveyQuestionStepper } from '~/components/backtalk/survey/SurveyQuestionStepper';
import { backtalkNewResponseContext } from '~/components/context/BacktalkNewResponse';
import { EthersContext } from '~/components/context/EthersContext';

export const Survey: FC = () => {
  const {
    surveyFetchState: { loading },
    surveyResponseData: data,
    surveyResponseDispatch,
  } = useContext(backtalkNewResponseContext);
  const { connected, isLoggedIn } = useContext(EthersContext);

  return (
    <Box
      background='purple.800'
      boxShadow='dark-lg'
      borderRadius='xl'
      color='white'
      my={8}
      p={5}>
      {loading ? (
        <Center h='100%'>Loading</Center>
      ) : data.id === -1 ? (
        <Center>Survey Not Found</Center>
      ) : (
        <>
          <Heading as='h1' mb={2} size='md'>
            {data.title}
          </Heading>
          {data.step < 0 ? (
            <Box>
              {data.description && <Text mb={4}>{data.description}</Text>}
              <Connect />
              {connected && isLoggedIn && (
                <Button
                  colorScheme='dark'
                  onClick={() =>
                    surveyResponseDispatch({ type: 'startSurvey' })
                  }>
                  Start
                </Button>
              )}
            </Box>
          ) : (
            <SurveyQuestionStepper />
          )}
        </>
      )}
    </Box>
  );
};
