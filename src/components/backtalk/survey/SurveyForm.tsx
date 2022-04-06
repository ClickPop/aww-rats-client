import {
  Flex,
  Heading,
  Box,
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Select,
  Checkbox,
  Button,
  useBoolean,
  Switch,
  VStack,
  HStack,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, {
  FormEventHandler,
  useContext,
  useEffect,
  useState,
} from 'react';
import { ActionBar } from '~/components/backtalk/ActionBar';
import { BacktalkSurveyFormContext } from '~/components/context/BacktalkSurveyForm';
import { EthersContext } from '~/components/context/EthersContext';
import { apolloBacktalkClient } from '~/lib/graphql';
import {
  Questions_Insert_Input,
  Question_Type_Enum,
  Token_Types_Enum,
  useCreateSurveyMutation,
} from '~/schema/generated';

export const SurveyForm = () => {
  const { push } = useRouter();
  const { signerAddr } = useContext(EthersContext);
  const [hasMaxResponses, { toggle }] = useBoolean(false);
  const [editingQuestion, { toggle: toggleEditingQuestion }] =
    useBoolean(false);
  const { surveyData, surveyDataDispatch } = useContext(
    BacktalkSurveyFormContext,
  );
  const { title, is_active, questions, contract_address } = surveyData;
  const [newQuestion, setNewQuestion] = useState<Questions_Insert_Input>({
    prompt: '',
    question_type: Question_Type_Enum.FreeResponse,
    is_required: (questions?.data.length ?? 0) < 1,
  });

  const [createSurvey] = useCreateSurveyMutation({
    client: apolloBacktalkClient,
  });

  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    console.log(signerAddr);
    if (signerAddr) {
      const res = await createSurvey({
        variables: {
          surveyInput: { ...surveyData, owner: signerAddr },
        },
      });
      if (res.data?.insert_surveys_one) {
        push(`/backtalk/results/${res.data.insert_surveys_one.id}`);
      }
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <Flex align='baseline' my={4}>
        <Heading as='h1' size='md'>
          New Survey
        </Heading>
      </Flex>

      <Box
        backgroundColor='white'
        border='1px'
        borderColor='gray.200'
        borderRadius={8}
        mb={16}
        p={4}>
        <FormControl mb={4} isRequired>
          <FormLabel htmlFor='surveyTitle'>Survey Title</FormLabel>
          <Input
            id='surveyTitle'
            placeholder='Name your survey'
            value={title!}
            onChange={(e) =>
              surveyDataDispatch({
                type: 'editTitle',
                payload: e.currentTarget.value,
              })
            }
          />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel htmlFor='contract'>Limit to Contract</FormLabel>
          <Input
            id='contract'
            value={contract_address ?? ''}
            onChange={(e) =>
              surveyDataDispatch({
                type: 'addContract',
                payload: {
                  address: e.currentTarget.value || null,
                  token_type: e.currentTarget.value
                    ? Token_Types_Enum.Erc721
                    : undefined,
                },
              })
            }
          />
          <FormHelperText>
            Leave this blank to let anyone with a wallet submit a response.
          </FormHelperText>
        </FormControl>
        <FormControl mb={8}>
          <Flex as={'span'}>
            <FormLabel htmlFor='maxResponses'>Max Responses</FormLabel>
            <Switch
              id='limit-responses'
              isChecked={hasMaxResponses}
              onChange={toggle}
            />
          </Flex>
          <NumberInput
            isDisabled={!hasMaxResponses}
            defaultValue={100}
            max={10000}
            min={0}>
            <NumberInputField id='amount' />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
        <Box>
          <Button onClick={toggleEditingQuestion} mb={4}>
            New Question
          </Button>
          <VStack w='100%'>
            {editingQuestion && (
              <Box w='100%'>
                <Heading as='h2' size='sm' mb={2}>
                  New Question
                </Heading>
                <FormControl mb={4}>
                  <FormLabel htmlFor='questionType'>Question Type</FormLabel>
                  <Select id='questionType' disabled>
                    <option>Free Response</option>
                    <option>Multiple Choice</option>
                  </Select>
                </FormControl>
                <FormControl mb={2} isRequired>
                  <FormLabel htmlFor='questionPrompt'>
                    Question Prompt
                  </FormLabel>
                  <Input
                    id='questionPrompt'
                    placeholder='Question to ask?'
                    value={newQuestion.prompt ?? ''}
                    onChange={(e) =>
                      setNewQuestion((nq) => ({
                        ...nq,
                        prompt: e.currentTarget.value,
                      }))
                    }
                  />
                </FormControl>
                <HStack w='100%' justify='space-between'>
                  <Checkbox
                    isChecked={!!newQuestion.is_required}
                    onChange={(e) =>
                      setNewQuestion((nq) => ({
                        ...nq,
                        is_required: e.currentTarget.checked,
                      }))
                    }>
                    Required
                  </Checkbox>
                  <Button
                    onClick={() => {
                      surveyDataDispatch({
                        type: 'addQuestion',
                        payload: newQuestion,
                      });
                      setNewQuestion({
                        prompt: '',
                        question_type: Question_Type_Enum.FreeResponse,
                        is_required: false,
                      });
                      toggleEditingQuestion();
                    }}>
                    Add
                  </Button>
                </HStack>
              </Box>
            )}
            {questions?.data?.map((q, i) => (
              <Box key={q.id ?? `${i}-${q.prompt}`} w='100%'>
                <HStack justify='space-between'>
                  <Heading as='h2' size='sm' mb={2}>
                    Question {i + 1}
                  </Heading>
                  <Button
                    onClick={() => {
                      surveyDataDispatch({
                        type: 'deleteQuestion',
                        payload: i,
                      });
                      setNewQuestion({
                        ...newQuestion,
                        is_required: (questions.data.length ?? 0) - 1 < 1,
                      });
                    }}>
                    Delete
                  </Button>
                </HStack>
                <FormControl mb={4}>
                  <FormLabel htmlFor='questionType'>Question Type</FormLabel>
                  <Select id='questionType' disabled>
                    <option>Free Response</option>
                    <option>Multiple Choice</option>
                  </Select>
                </FormControl>
                <FormControl mb={2}>
                  <FormLabel htmlFor='questionPrompt'>
                    Question Prompt
                  </FormLabel>
                  <Input
                    id='questionPrompt'
                    placeholder='Question to ask?'
                    disabled
                    value={q.prompt ?? ''}
                  />
                </FormControl>
                <Checkbox disabled isChecked={q.is_required ?? false}>
                  Required
                </Checkbox>
              </Box>
            ))}
          </VStack>
        </Box>
      </Box>

      <ActionBar>
        <Button colorScheme='teal' size='sm' variant='link'>
          Preview
        </Button>
        <Button colorScheme='teal' ml={2} size='sm' type='submit'>
          Publish
        </Button>
      </ActionBar>
    </form>
  );
};
