import {
  Box,
  Button,
  Center,
  HStack,
  Progress,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import { FC, FormEventHandler, useContext } from 'react';
import { backtalkNewResponseContext } from '~/components/context/BacktalkNewResponse';
import { apolloBacktalkClient } from '~/lib/graphql';
import { useCreateResponsesMutation } from '~/schema/generated';

const getFreeResponseState = (length: number) => {
  if (length < 240) {
    return 'good';
  } else if (length >= 240 && length <= 280) {
    return 'warn';
  } else {
    return 'error';
  }
};

const getColorFromState = (
  state: 'good' | 'warn' | 'error',
  fallback?: string,
) => {
  switch (state) {
    case 'error':
      return 'red';
    case 'warn':
      return 'yellow';
    default:
      return fallback;
  }
};

export const SurveyQuestionStepper: FC = () => {
  const {
    surveyResponseData: {
      contract,
      questions,
      step,
      responses,
      currentResponse: { response_content },
    },
    surveyResponseDispatch,
  } = useContext(backtalkNewResponseContext);

  const [createResponses, { loading, error, called }] =
    useCreateResponsesMutation({
      client: apolloBacktalkClient,
    });

  const noMoreSteps = step === questions?.length;
  const currentQuestion = noMoreSteps ? null : questions?.[step];

  const freeResponseState = getFreeResponseState(response_content?.length ?? 0);

  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    await createResponses({
      variables: {
        responseInput: responses,
      },
    });
  };

  return (
    <form onSubmit={onSubmit}>
      <VStack>
        <VStack w='100%' alignItems='start'>
          {!noMoreSteps && (
            <Text>
              {step + 1}/{questions?.length ?? 0}
            </Text>
          )}
          <Progress
            colorScheme='purple'
            w='100%'
            size='xs'
            value={(step / (questions?.length ?? 0)) * 100}
          />
        </VStack>
        {currentQuestion && (
          <>
            <Text>{currentQuestion.prompt}</Text>
            <Textarea
              value={response_content ?? ''}
              onChange={(e) =>
                surveyResponseDispatch({
                  type: 'updateCurrentResponseFreeForm',
                  payload: e.currentTarget.value,
                })
              }
              resize='none'
              isInvalid={freeResponseState === 'error'}
            />
            <Text alignSelf='end' color={getColorFromState(freeResponseState)}>
              {response_content?.length ?? 0} / 280
            </Text>
          </>
        )}
        {noMoreSteps &&
          questions
            .filter((q) => !!responses.find((r) => q.id === r.question_id))
            .map((q) => (
              <Box key={q.id}>
                <Text>{q.prompt}</Text>
                <Text>
                  {
                    responses.find((r) => q.id === r.question_id)
                      ?.response_content
                  }
                </Text>
              </Box>
            ))}
        <HStack>
          {step !== 0 && (
            <Button
              colorScheme='dark'
              onClick={() => surveyResponseDispatch({ type: 'previousStep' })}>
              Back
            </Button>
          )}
          {!noMoreSteps && (
            <Button
              colorScheme='dark'
              onClick={() => surveyResponseDispatch({ type: 'nextStep' })}
              disabled={freeResponseState === 'error'}>
              Next
            </Button>
          )}
          {noMoreSteps && (
            <Button colorScheme='dark' type='submit' isLoading={loading}>
              Submit
            </Button>
          )}
        </HStack>
      </VStack>
    </form>
  );
};
