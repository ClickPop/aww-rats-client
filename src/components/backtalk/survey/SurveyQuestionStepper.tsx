import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  HStack,
  Progress,
  Radio,
  RadioGroup,
  Stack,
  Text,
  Textarea,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { FC, FormEventHandler, useContext, useEffect } from 'react';
import { backtalkNewResponseContext } from '~/components/context/BacktalkNewResponse';
import { apolloBacktalkClient } from '~/lib/graphql';
import {
  Question_Type_Enum,
  useCreateResponsesMutation,
} from '~/schema/generated';

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
      id,
      questions,
      step,
      responses,
      currentResponse: { response_content, response_option_id },
    },
    surveyResponseDispatch,
  } = useContext(backtalkNewResponseContext);

  const [createResponses, { loading, error }] = useCreateResponsesMutation({
    client: apolloBacktalkClient,
  });

  const toast = useToast();

  useEffect(() => {
    if (!loading && error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        position: 'bottom-right',
        isClosable: true,
      });
    }
  }, [error, loading, toast]);

  const noMoreSteps = step === questions?.length;
  const currentQuestion = noMoreSteps ? null : questions?.[step];

  const freeResponseState = getFreeResponseState(response_content?.length ?? 0);

  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    await createResponses({
      variables: {
        responseInput: {
          survey_id: id,
          responses,
        },
      },
    });
    surveyResponseDispatch({ type: 'endSurvey' });
  };

  return (
    <form onSubmit={onSubmit}>
      <VStack alignItems='start'>
        <VStack w='100%' alignItems='start' mb={2}>
          {!noMoreSteps ? (
            <Text fontSize='xs'>
              {step + 1}/{questions?.length ?? 0}
            </Text>
          ) : (
            <Text fontSize='xs'>Review Answers</Text>
          )}
          <Progress
            colorScheme='purple'
            size='xs'
            w='100%'
            value={(step / (questions?.length ?? 0)) * 100}
          />
        </VStack>
        {currentQuestion && (
          <FormControl isRequired={!!currentQuestion.is_required}>
            <FormLabel
              htmlFor={`${currentQuestion.id}-response`}
              pb={2}
              textAlign='left'>
              {currentQuestion.prompt}
            </FormLabel>
            {currentQuestion.question_type ===
            Question_Type_Enum.FreeResponse ? (
              <>
                <Textarea
                  id={`${currentQuestion.id}-response`}
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
                <Text
                  alignSelf='end'
                  fontSize={'xs'}
                  color={getColorFromState(freeResponseState)}>
                  {response_content?.length ?? 0} / 280
                </Text>
              </>
            ) : (
              <>
                <RadioGroup>
                  <Stack>
                    {currentQuestion.options.map(({ id, content }) => (
                      <Radio
                        key={id}
                        isChecked={response_option_id === id}
                        onChange={(e) =>
                          e.currentTarget.checked &&
                          surveyResponseDispatch({
                            type: 'updateCurrentResponseMultipleChoice',
                            payload: {
                              id,
                              content,
                            },
                          })
                        }>
                        {content}
                      </Radio>
                    ))}
                  </Stack>
                </RadioGroup>
              </>
            )}
          </FormControl>
        )}
        {noMoreSteps &&
          questions
            .filter((q) => !!responses.find((r) => q.id === r.question_id))
            .map((q) => (
              <Box key={q.id}>
                <Text fontWeight='600'>Q. {q.prompt}</Text>
                <Text>
                  A.{' '}
                  {
                    responses.find((r) => q.id === r.question_id)
                      ?.response_content
                  }
                </Text>
              </Box>
            ))}
        <HStack pt={2} width='100%'>
          {step !== 0 && (
            <Button
              colorScheme='gray'
              size='md'
              variant='outline'
              width='100%'
              _hover={{
                backgroundColor: 'gray.200',
                color: 'black',
              }}
              onClick={() => surveyResponseDispatch({ type: 'previousStep' })}>
              Back
            </Button>
          )}
          {!noMoreSteps && (
            <Button
              colorScheme='gray'
              size='md'
              variant='outline'
              width='100%'
              _hover={{
                backgroundColor: 'gray.200',
                color: 'black',
              }}
              onClick={() => surveyResponseDispatch({ type: 'nextStep' })}
              disabled={
                freeResponseState === 'error' ||
                !!(currentQuestion?.is_required && !response_content)
              }>
              Next
            </Button>
          )}
          {noMoreSteps && (
            <Button
              colorScheme='gray'
              size='md'
              variant='outline'
              width='100%'
              _hover={{
                backgroundColor: 'gray.200',
                color: 'black',
              }}
              isDisabled={responses.every((r) => !r.response_content)}
              type='submit'
              isLoading={loading}>
              Submit
            </Button>
          )}
        </HStack>
      </VStack>
    </form>
  );
};
