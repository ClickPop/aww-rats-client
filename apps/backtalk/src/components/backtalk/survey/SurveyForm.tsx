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
  Radio,
  RadioGroup,
  Stack,
  InputGroup,
  InputRightElement,
  Modal,
  useDisclosure,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Grid,
  GridItem,
  AspectRatio,
  Center,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, {
  ChangeEventHandler,
  FormEventHandler,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { ActionBar } from '~/components/backtalk/ActionBar';
import NextImage from 'next/image';
import EthLogo from 'src/assets/images/eth-logo.webp';
import PolygonLogo from 'src/assets/images/matic-logo.webp';
import { BacktalkSurveyFormContext } from '~/components/context/BacktalkSurveyForm';
import { EthersContext } from 'common/components/context/EthersContext';
import {
  Question_Type_Enum,
  Supported_Chains_Enum,
  useCreateSurveyMutation,
  useGetImagesByWalletQuery,
} from '~/schema/generated';
import { utils } from 'ethers';
import { useSignerAddress } from 'common/hooks/useSignerAddress';
import { Image } from '~/components/shared/Image';
import { hashids } from '~/utils/hash-ids';

export const SurveyForm = () => {
  const { push } = useRouter();
  const signerAddr = useSignerAddress();
  const [hasMaxResponses, { toggle: toggleMaxResponses }] = useBoolean(false);
  const [hasContracts, { toggle: toggleContracts }] = useBoolean(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { surveyData, surveyDataDispatch } = useContext(
    BacktalkSurveyFormContext,
  );
  const [maxResponses, setMaxResponses] = useState(100);
  const { title, questions, contracts } = surveyData;
  const [contractAddress, setContractAddress] = useState<{
    index: number;
    address: string;
  } | null>(null);
  const [prompt, setPrompt] = useState<{
    index: number;
    prompt: string;
  } | null>(null);
  const [option, setOption] = useState<{
    index: number;
    question_index: number;
    content: string;
  } | null>(null);
  const [error, setError] = useState<{ contract: boolean }>({
    contract: false,
  });

  const [createSurvey, { loading }] = useCreateSurveyMutation();
  const {
    data: imageData,
    loading: imageLoading,
    error: imageError,
  } = useGetImagesByWalletQuery({
    variables: {
      wallet: signerAddr!,
    },
    skip: !signerAddr,
  });

  const imageUrl = useMemo(
    () =>
      imageData?.survey_images?.find(
        (image) => image.id === surveyData?.image_id,
      ),
    [imageData?.survey_images, surveyData?.image_id],
  );

  useEffect(() => {
    surveyDataDispatch({
      type: 'updateMaxResponses',
      payload: hasMaxResponses ? maxResponses : null,
    });
  }, [hasMaxResponses, maxResponses, surveyDataDispatch]);

  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (signerAddr) {
      const res = await createSurvey({
        variables: {
          surveyInput: {
            ...surveyData,
            is_active: true,
            owner: signerAddr,
            contracts: surveyData.contracts
              ? {
                  ...surveyData.contracts,
                  data: surveyData.contracts.data.map((c, i) =>
                    contractAddress?.index === i
                      ? { ...c, address: contractAddress.address }
                      : c,
                  ),
                }
              : undefined,
            questions: surveyData.questions
              ? {
                  ...surveyData.questions,
                  data: surveyData.questions.data.map((q, i) => ({
                    ...q,
                    prompt:
                      prompt && prompt.index === i && prompt.prompt
                        ? prompt.prompt
                        : q.prompt,
                    options: q.options
                      ? {
                          ...q.options,
                          data: q.options.data.map((o, idx) => ({
                            ...o,
                            content:
                              option &&
                              option.question_index === i &&
                              option.index === idx &&
                              option.content
                                ? option.content
                                : o.content,
                          })),
                        }
                      : undefined,
                  })),
                }
              : undefined,
          },
        },
      });
      if (res.data?.insert_surveys_one) {
        push(`/results/${hashids.encode(res.data.insert_surveys_one.id)}`);
      }
    }
  };

  const handleContractChange: ChangeEventHandler<HTMLInputElement> = async (
    e,
  ) => {
    const val = e.currentTarget.value;
    const isAddress = !!(val && utils.isAddress(val));

    if (contractAddress) {
      setContractAddress({
        index: contractAddress.index,
        address: val,
      });
    }

    setError((err) => ({
      ...err,
      contract: !val ? false : !isAddress,
    }));
  };

  useEffect(() => {
    if (!hasContracts) {
      surveyDataDispatch({ type: 'deleteContracts' });
    }
  }, [hasContracts, surveyDataDispatch]);

  const validForm =
    !!title &&
    (questions?.data.length ?? 0) > 0 &&
    !!questions?.data.some((q) => q.is_required) &&
    !!questions?.data.every(
      (q, i) => !!q.prompt || (prompt && prompt.index === i && prompt.prompt),
    ) &&
    !!questions.data
      .filter((q) => q.question_type === Question_Type_Enum.MultipleChoice)
      .every(
        (q, i) =>
          (q.options?.data.length ?? 0) >= 2 &&
          q.options?.data.every(
            (o, idx) =>
              !!o.content ||
              (option &&
                option.index === i &&
                option.question_index === idx &&
                option.content),
          ),
      ) &&
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
        <Box mb={4}>
          {!!surveyData?.image_id && !!imageUrl ? (
            <AspectRatio rounded='full' w='200px' overflow='hidden' ratio={1}>
              <Box width='100%' h='100%' position='relative'>
                <Image src={imageUrl.url} layout='fill' />
                <Center
                  position='absolute'
                  width='100%'
                  height='100%'
                  onClick={() => surveyDataDispatch({ type: 'deleteImage' })}
                  opacity='0%'
                  _hover={{ opacity: '100%' }}
                  bg='rgba(100, 100, 100, 0.8)'
                  color='white'
                  transition='opacity 100ms ease'
                  cursor='pointer'>
                  Remove Image
                </Center>
              </Box>
            </AspectRatio>
          ) : (
            <Button onClick={onOpen}>Add Image</Button>
          )}
        </Box>
        <Modal onClose={onClose} isOpen={isOpen} size='xl'>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Choose an Image...</ModalHeader>
            <ModalCloseButton />
            <ModalBody maxH={{ base: '100vh', sm: '50vh' }} overflow='scroll'>
              <Grid
                gap={4}
                templateColumns={{
                  base: 'repeat(2, 1fr)',
                  sm: 'repeat(3, 1fr)',
                }}>
                {imageData?.survey_images?.map((image) => (
                  <AspectRatio
                    rounded='full'
                    overflow='hidden'
                    key={`image-${image.id}`}
                    ratio={1}>
                    <GridItem
                      width='100%'
                      h='100%'
                      position='relative'
                      cursor='pointer'>
                      <Image
                        onClick={() => {
                          surveyDataDispatch({
                            type: 'addImage',
                            payload: image.id,
                          });
                          onClose();
                        }}
                        src={image.url}
                        layout='fill'
                      />
                    </GridItem>
                  </AspectRatio>
                ))}
              </Grid>
            </ModalBody>
          </ModalContent>
        </Modal>
        <FormControl mb={4} isInvalid={error.contract}>
          <Flex as='span'>
            <FormLabel htmlFor='contract'>Limit to Contract</FormLabel>
            <Switch
              id='limit-responses'
              isChecked={hasContracts}
              onChange={toggleContracts}
            />
          </Flex>
          {hasContracts &&
            contracts?.data.map((contract, i) => (
              <>
                <InputGroup>
                  <Input
                    id='contract'
                    value={
                      contractAddress?.index === i
                        ? contractAddress.address
                        : contract?.address ?? ''
                    }
                    onFocus={() =>
                      setContractAddress({
                        index: i,
                        address: contract?.address ?? '',
                      })
                    }
                    onBlur={() => {
                      if (contractAddress) {
                        surveyDataDispatch({
                          type: 'editContractAddress',
                          payload: contractAddress,
                        });
                      }
                      setContractAddress(null);
                    }}
                    onChange={handleContractChange}
                  />
                  <InputRightElement w='fit-content'>
                    <Button
                      w='90%'
                      h='85%'
                      onClick={() =>
                        surveyDataDispatch({
                          type: 'deleteContract',
                          payload: i,
                        })
                      }>
                      Delete
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <RadioGroup
                  my={2}
                  isDisabled={
                    (contractAddress?.index === i
                      ? !contractAddress.address
                      : !contract?.address) || !!error.contract
                  }
                  defaultValue={Supported_Chains_Enum.Ethereum}
                  onChange={(e) => {
                    surveyDataDispatch({
                      type: 'editChain',
                      payload: {
                        chain: e as Supported_Chains_Enum,
                        index: i,
                      },
                    });
                  }}
                  value={contract.chain ?? ''}>
                  <HStack direction='row'>
                    <Radio value={Supported_Chains_Enum.Ethereum}>
                      <NextImage
                        alt='ETH Log'
                        height='16'
                        src={EthLogo}
                        width='16'
                      />{' '}
                      ETH Mainnet
                    </Radio>
                    <Radio value={Supported_Chains_Enum.Polygon}>
                      <NextImage
                        alt='ETH Log'
                        height='16'
                        src={PolygonLogo}
                        width='16'
                      />{' '}
                      Polygon
                    </Radio>
                  </HStack>
                </RadioGroup>
              </>
            ))}
          <Button
            isDisabled={!hasContracts}
            onClick={() => surveyDataDispatch({ type: 'addContract' })}>
            Add Contract
          </Button>
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
              onChange={toggleMaxResponses}
            />
          </Flex>
          <NumberInput
            isDisabled={!hasMaxResponses}
            defaultValue={100}
            max={10000}
            min={0}
            value={maxResponses}
            onChange={(e) => setMaxResponses(Number(e))}>
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
              <Box key={q.id ?? `${i}-${q.prompt}`} w='100%' mb={8}>
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
                  <Select
                    id='questionType'
                    onChange={(e) => {
                      const val = e.currentTarget.value as Question_Type_Enum;
                      surveyDataDispatch({
                        type: 'editQuestionType',
                        payload: {
                          index: i,
                          questionType: val,
                        },
                      });
                    }}>
                    <option value={Question_Type_Enum.FreeResponse}>
                      Free Response
                    </option>
                    <option value={Question_Type_Enum.MultipleChoice}>
                      Multiple Choice
                    </option>
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
                        type: 'editQuestionPrompt',
                        payload: {
                          index: i,
                          prompt: e.currentTarget.value,
                        },
                      });

                      setPrompt(null);
                    }}
                  />
                </FormControl>
                <Checkbox
                  mb={4}
                  isChecked={q.is_required ?? false}
                  onChange={(e) =>
                    surveyDataDispatch({
                      type: 'editQuestionRequired',
                      payload: {
                        index: i,
                        required: e.currentTarget.checked,
                      },
                    })
                  }>
                  Required
                </Checkbox>
                {q.question_type === Question_Type_Enum.MultipleChoice && (
                  <FormControl>
                    <FormLabel>Choices</FormLabel>
                    <Stack>
                      {q.options?.data.map((o, idx) => (
                        <InputGroup key={(o.content ?? '') + idx}>
                          <Input
                            value={
                              option?.index === idx &&
                              option.question_index === i
                                ? option.content
                                : o.content ?? ''
                            }
                            onChange={(e) =>
                              setOption({
                                index: idx,
                                question_index: i,
                                content: e.currentTarget.value,
                              })
                            }
                            onFocus={(e) =>
                              setOption({
                                index: idx,
                                question_index: i,
                                content: e.currentTarget.value,
                              })
                            }
                            onBlur={(e) => {
                              surveyDataDispatch({
                                type: 'editQuestionOption',
                                payload: {
                                  question_index: i,
                                  option_index: idx,
                                  content: e.currentTarget.value,
                                },
                              });
                              setOption(null);
                            }}
                          />
                          <InputRightElement w='fit-content'>
                            <Button
                              onClick={() =>
                                surveyDataDispatch({
                                  type: 'deleteQuestionOption',
                                  payload: {
                                    question_index: i,
                                    option_index: idx,
                                  },
                                })
                              }
                              isDisabled={(q.options?.data.length ?? 0) < 3}
                              h='80%'
                              w='90%'>
                              Delete
                            </Button>
                          </InputRightElement>
                        </InputGroup>
                      ))}
                      <Button
                        onClick={() =>
                          surveyDataDispatch({
                            type: 'addQuestionOption',
                            payload: {
                              index: i,
                            },
                          })
                        }>
                        New Choice
                      </Button>
                    </Stack>
                  </FormControl>
                )}
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
