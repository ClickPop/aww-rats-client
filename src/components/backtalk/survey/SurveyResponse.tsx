import { Box, Button, Center, Heading, Text } from '@chakra-ui/react';
import React, { FC, useContext, useEffect } from 'react';
import Link from 'next/link';
import { Emoji } from '~/components/shared/Emoji';
import { Connect } from '~/components/backtalk/Connect';
import { SurveyQuestionStepper } from '~/components/backtalk/survey/SurveyQuestionStepper';
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
    return (
      <>
        <Heading as='h1' mb={2} size='md'>
          Woo-hoo!{' '}
          <Emoji aria-label='Party'>
            🎉
          </Emoji>
        </Heading>
        <Text mb={2}>
          Thanks so much for your feedback for {data.title}.
        </Text>
        <Text>
          Want to make a web3 survey of your own? 
        </Text>
        <Link href='/backtalk'>
          <Button
            colorScheme='gray'
            mt={4}
            size='md'
            variant='outline'
            _hover= {{
              backgroundColor: 'gray.200',
              color: 'black'
            }}
          >
            Make one now
          </Button>
        </Link>
      </>
    );
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
              colorScheme='gray'
              mt={4}
              size='md'
              variant='outline'
              width='100%'
              _hover= {{
                backgroundColor: 'gray.200',
                color: 'black'
              }}
              onClick={() => surveyResponseDispatch({ type: 'startSurvey' })}>
              <Emoji mr='0.5ch' aria-label='Right Arrow'>
                {' '}
                ➡️{' '}
              </Emoji>{' '}
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
