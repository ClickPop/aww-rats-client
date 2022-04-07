import { Box, Button, Center, Heading, Text } from '@chakra-ui/react';
import React, { FC, useContext, useEffect } from 'react';
import { Connect } from '~/components/backtalk/Connect';
import { SurveyQuestionStepper } from '~/components/backtalk/survey/SurveyQuestionStepper';
import { SurveyWrapper } from '~/components/backtalk/survey/SurveyWrapper';
import { backtalkNewResponseContext } from '~/components/context/BacktalkNewResponse';
import { EthersContext } from '~/components/context/EthersContext';

export const SurveyResponse: FC = () => {
  const {
    surveyFetchState: { loading },
    surveyResponseData: data,
    surveyResponseDispatch,
  } = useContext(backtalkNewResponseContext);
  const { connected, isLoggedIn } = useContext(EthersContext);

  useEffect(() => {
    if (
      data?.questions?.some((q) => q.callerResponses.length > 0) &&
      data.step !== data.questions.length + 1
    ) {
      surveyResponseDispatch({
        type: 'endSurvey',
      });
    }
  }, [data, surveyResponseDispatch]);

  const surveyEnd = data.step === data?.questions?.length + 1;

  if (loading) {
    return <Center h='100%'>Loading</Center>;
  }

  if (data.id === -1) {
    return <Center>Survey Not Found</Center>;
  }

  if (surveyEnd) {
    return <Center>The survey is OVER!</Center>;
  }

  return (
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
              onClick={() => surveyResponseDispatch({ type: 'startSurvey' })}>
              Start
            </Button>
          )}
        </Box>
      ) : (
        <SurveyQuestionStepper />
      )}
    </>
  );
};
