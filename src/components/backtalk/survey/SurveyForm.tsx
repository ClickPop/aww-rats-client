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
  Textarea,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, {
  ChangeEventHandler,
  FormEventHandler,
  useContext,
  useMemo,
  useState,
} from 'react';
import { ActionBar } from '~/components/backtalk/ActionBar';
import { BacktalkSurveyFormContext } from '~/components/context/BacktalkSurveyForm';
import { EthersContext } from '~/components/context/EthersContext';
import { apolloBacktalkClient } from '~/lib/graphql';
import {
  Question_Type_Enum,
  Token_Types_Enum,
  useCreateSurveyMutation,
  useGetContractByAddressLazyQuery,
} from '~/schema/generated';
import { utils } from 'ethers';

export const SurveyForm = () => {
  const { push } = useRouter();
  const { signerAddr } = useContext(EthersContext);
  const [hasMaxResponses, { toggle }] = useBoolean(false);
  const { surveyData, surveyDataDispatch } = useContext(
    BacktalkSurveyFormContext,
  );
  const { title, questions, contract, contract_address } = surveyData;
  const [prompt, setPrompt] = useState<{
    index: number;
    prompt: string;
  } | null>(null);
  const [error, setError] = useState<{ contract: boolean }>({
    contract: false,
  });

  const [getContractByAddress, { loading: getContractLoading }] =
    useGetContractByAddressLazyQuery({
      client: apolloBacktalkClient,
    });

  const [createSurvey, { loading }] = useCreateSurveyMutation({
    client: apolloBacktalkClient,
  });

  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (signerAddr) {
      const res = await createSurvey({
        variables: {
          surveyInput: { ...surveyData, is_active: true, owner: signerAddr },
        },
      });
      if (res.data?.insert_surveys_one) {
        push(`/backtalk/results/${res.data.insert_surveys_one.id}`);
      }
    }
  };

  const handleContractChange: ChangeEventHandler<HTMLInputElement> = async (
    e,
  ) => {
    const val = e.currentTarget.value;
    const isAddress = !!(val && utils.isAddress(val));

    surveyDataDispatch({
      type: 'addContract',
      payload: {
        address: val || null,
        token_type: val ? Token_Types_Enum.Erc721 : undefined,
      },
    });

    if (isAddress) {
      const res = await getContractByAddress({
        variables: { address: val },
      });

      if (res?.data?.contracts_by_pk) {
        surveyDataDispatch({
          type: 'addContractAddress',
          payload: res.data.contracts_by_pk.address,
        });
      }
    }

    setError((err) => ({
      ...err,
      contract: !val ? false : !isAddress,
    }));
  };

  const validForm =
    !!title &&
    (questions?.data.length ?? 0) > 0 &&
    !!questions?.data.some((q) => q.is_required) &&
    !!questions?.data.every((q) => !!q.prompt) &&
    !error.contract;

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
          <FormLabel htmlFor='survey-description'>Survey Description</FormLabel>
          <Textarea
            value={surveyData.description ?? ''}
            onChange={(e) =>
              surveyDataDispatch({
                type: 'editDescription',
                payload: e.currentTarget.value,
              })
            }
            resize='none'
          />
        </FormControl>
        <FormControl mb={4} isInvalid={error.contract}>
          <FormLabel htmlFor='contract'>Limit to Contract</FormLabel>
          <Input
            id='contract'
            value={contract_address ?? contract?.data.address ?? ''}
            onChange={handleContractChange}
            isDisabled={getContractLoading}
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
          <VStack w='100%'>
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
                    value={prompt?.index === i ? prompt.prompt : q.prompt ?? ''}
                    onChange={(e) =>
                      setPrompt({ index: i, prompt: e.currentTarget.value })
                    }
                    onFocus={(e) =>
                      setPrompt({ index: i, prompt: e.currentTarget.value })
                    }
                    onBlur={(e) => {
                      surveyDataDispatch({
                        type: 'editQuestion',
                        payload: {
                          index: i,
                          question: {
                            ...q,
                            prompt: e.currentTarget.value,
                          },
                        },
                      });

                      setPrompt(null);
                    }}
                  />
                </FormControl>
                <Checkbox
                  isChecked={q.is_required ?? false}
                  onChange={(e) =>
                    surveyDataDispatch({
                      type: 'editQuestion',
                      payload: {
                        index: i,
                        question: {
                          ...q,
                          is_required: e.currentTarget.checked,
                        },
                      },
                    })
                  }>
                  Required
                </Checkbox>
              </Box>
            ))}
          </VStack>
          <Button
            onClick={() =>
              surveyDataDispatch({
                type: 'addQuestion',
                payload: {
                  prompt: '',
                  is_required: (questions?.data.length ?? 0) < 1,
                  question_type: Question_Type_Enum.FreeResponse,
                },
              })
            }
            mb={4}>
            New Question
          </Button>
        </Box>
      </Box>

      <ActionBar>
        <Button
          colorScheme='teal'
          ml={2}
          size='sm'
          type='submit'
          name='submit'
          isDisabled={!validForm}
          isLoading={loading}>
          Publish
        </Button>
      </ActionBar>
    </form>
  );
};
