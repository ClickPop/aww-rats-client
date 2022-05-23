import {
  Flex,
  Heading,
  Spacer,
  Grid,
  GridItem,
  Progress,
  Text,
  Button,
  Box,
  FormControl,
  FormLabel,
  Switch,
  Center,
  useToast,
  Link,
  useClipboard,
  Input,
  HStack,
  VStack,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverBody,
  PopoverFooter,
  useDisclosure,
  Tooltip,
} from '@chakra-ui/react';
import { useSignerAddress } from 'common/hooks/useSignerAddress';
import { format } from 'date-fns';
import { useRouter } from 'next/router';
import React, { FC, useContext, useEffect, useMemo } from 'react';
import { SurveyResultsList } from '~/components/backtalk/results/SurveyResultsList';
import { BacktalkSurveyResultContext } from '~/components/context/BacktalkSurveyResults';
import { hashids } from '~/utils/hash-ids';
import {
  Question_Type_Enum,
  useUpdateSurveyMutation,
  useDeleteSurveyMutation,
} from '~/schema/generated';

type Props = {
  host?: string;
};

export const SurveyResults: FC<Props> = ({ host }) => {
  const {
    surveyResult: { data, loading: surveyLoading, error: surveyError, refetch },
  } = useContext(BacktalkSurveyResultContext);

  const [updateSurvey, { loading, error }] = useUpdateSurveyMutation();
  const [deleteSurvey, { loading: deleteLoading, error: deleteError }] =
    useDeleteSurveyMutation();

  const { onOpen, onClose, isOpen } = useDisclosure();

  const signerAddr = useSignerAddress();

  const isOwner = data?.surveys_by_pk?.owner === signerAddr;

  const toast = useToast();

  const { push } = useRouter();

  const multiChoiceData = useMemo(
    () =>
      data?.surveys_by_pk?.questions
        .filter((q) => q.question_type === Question_Type_Enum.MultipleChoice)
        .map((q) => ({
          id: q.id,
          prompt: q.prompt,
          responses_aggregate: q?.responses_aggregate,
          options: q.options.map((o) => ({
            x: q?.responses_aggregate?.aggregate?.count
              ? o?.responses_aggregate?.aggregate?.count
              : null,
            label: o.content,
          })),
        }))
        .filter((q) => q.options.every((o) => o.x !== null)),
    [data?.surveys_by_pk?.questions],
  );

  useEffect(() => {
    if (!loading && error) {
      toast({
        title: 'Error',
        description: 'Could not update survey',
        status: 'error',
        position: 'bottom-right',
        isClosable: true,
      });
    }
  }, [error, loading, toast]);

  useEffect(() => {
    if (!surveyLoading && surveyError) {
      toast({
        title: 'Error',
        description: 'Could not fetch survey',
        status: 'error',
        position: 'bottom-right',
        isClosable: true,
      });
    }
  }, [surveyError, surveyLoading, toast]);

  const surveyLink = useMemo(
    () => `/survey/${hashids.encode(data?.surveys_by_pk?.id ?? -1)}`,
    [data?.surveys_by_pk?.id],
  );

  const { hasCopied, onCopy } = useClipboard(surveyLink);

  const handleDataExport = () => {
    const headers = `Wallet,Date,${data?.surveys_by_pk?.contracts
      .map((c) => `Tokens for ${c.address}`)
      .join()}${
      data?.surveys_by_pk?.contracts.length ? ',' : ''
    }${data?.surveys_by_pk?.questions.map((q) => q.prompt).join()}`;

    const rows =
      data?.surveys_by_pk?.survey_responses
        ?.filter((r) => r.wallet !== null)
        ?.map(
          (r) =>
            `${r.wallet},${
              '"' +
              format(
                new Date(r.created_at),
                "eeee, MMMM d, yyyy 'at' H:mm  (z)",
              ) +
              '"'
            },${data?.surveys_by_pk?.contracts
              .map((c) => r.token_count[c.address])
              .join()}${
              data?.surveys_by_pk?.contracts.length ? ',' : ''
            }${data?.surveys_by_pk?.questions.map((q) => {
              const response = r.question_responses?.[`${q.id}`].response;
              return response ?? ' ';
            })}`,
        ) ?? [];
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'csv' });
    const a = document.createElement('a');
    a.download = `backtalk-survey-${data?.surveys_by_pk?.id}.csv`;
    a.href = window.URL.createObjectURL(blob);
    a.click();
    a.remove();
  };

  if (surveyLoading) {
    return <Center>Loading</Center>;
  }

  if (!data?.surveys_by_pk?.is_public && !isOwner) {
    return <Center>Survey is not public</Center>;
  }

  return data?.surveys_by_pk ? (
    <Box px={2}>
      <Flex align='baseline' my={4}>
        <Heading size='md'>{data.surveys_by_pk.title}</Heading>
        <Spacer />
        {isOwner && (
          <>
            <FormControl display='flex' alignItems='center' w={32}>
              <FormLabel htmlFor='isactive' mb='0'>
                Activate
              </FormLabel>
              <Switch
                isChecked={data?.surveys_by_pk.is_active ?? false}
                onChange={async (e) => {
                  if (data.surveys_by_pk?.id) {
                    await updateSurvey({
                      variables: {
                        id: data.surveys_by_pk?.id,
                        surveyInput: {
                          is_active: e.currentTarget.checked,
                        },
                      },
                    });

                    await refetch();
                  }
                }}
                isDisabled={loading}
                id='isactive'
              />
            </FormControl>
            <FormControl display='flex' alignItems='center' w={32}>
              <FormLabel htmlFor='ispublic' mb='0'>
                Public
              </FormLabel>
              <Switch
                isChecked={data?.surveys_by_pk.is_public ?? false}
                onChange={async (e) => {
                  if (data.surveys_by_pk?.id) {
                    await updateSurvey({
                      variables: {
                        id: data.surveys_by_pk?.id,
                        surveyInput: {
                          is_public: e.currentTarget.checked,
                        },
                      },
                    });

                    await refetch();
                  }
                }}
                isDisabled={loading}
                id='ispublic'
              />
            </FormControl>
            <Button
              onClick={handleDataExport}
              colorScheme='teal'
              ml={2}
              size='xs'>
              Export
            </Button>
            <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
              <PopoverTrigger>
                <Button ml={2} colorScheme='red' size='xs'>
                  Delete
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverBody>
                  <Text>Are you sure you want to delete this survey?</Text>
                  <Text fontWeight='bold'>This cannot be undone!</Text>
                </PopoverBody>
                <PopoverFooter>
                  <HStack justifyContent='end'>
                    <Button onClick={onClose} colorScheme='red' size='xs'>
                      No
                    </Button>
                    <Button
                      onClick={async () => {
                        if (data?.surveys_by_pk?.id) {
                          await deleteSurvey({
                            variables: {
                              id: data.surveys_by_pk.id,
                            },
                          });
                          push('/');
                        }
                      }}
                      isLoading={deleteLoading}
                      colorScheme='teal'
                      size='xs'>
                      Yes
                    </Button>
                  </HStack>
                </PopoverFooter>
              </PopoverContent>
            </Popover>
          </>
        )}
      </Flex>
      <Flex mb={4} alignItems='center'>
        <Input value={`${host}${surveyLink}`} isReadOnly />
        <Button onClick={onCopy} ml={2} colorScheme='teal' size='sm'>
          {hasCopied ? 'Copied' : 'Copy'}
        </Button>
        <Link href={surveyLink} ml={2} isExternal>
          View
        </Link>
      </Flex>
      <Grid
        gap={4}
        templateColumns={{ base: 'repeat(1, 1fr)', lg: 'repeat(2, 1fr)' }}>
        <GridItem
          backgroundColor='white'
          border='1px'
          borderColor='gray.200'
          borderRadius={8}
          p={4}>
          <Text color='gray.500' fontSize='xs' fontWeight='700'>
            Responses
          </Text>
          <Text fontSize='xl'>
            {!!data.surveys_by_pk.max_responses
              ? `${data?.surveys_by_pk?.response_count}/${data.surveys_by_pk.max_responses}`
              : data?.surveys_by_pk?.response_count}
          </Text>
          {!!data.surveys_by_pk.max_responses && (
            <Progress
              colorScheme='purple'
              value={data?.surveys_by_pk?.response_count}
              max={data.surveys_by_pk.max_responses}
              borderRadius={2}
            />
          )}
        </GridItem>

        <GridItem
          backgroundColor='white'
          border='1px'
          borderColor='gray.200'
          borderRadius={8}
          p={4}>
          <Text color='gray.500' fontSize='xs' fontWeight='700'>
            Last Response
          </Text>
          {!!data?.surveys_by_pk?.latest_response && (
            <Text fontSize='xl'>
              {format(
                new Date(data.surveys_by_pk.latest_response),
                "eeee, MMMM d, yyyy 'at' H:mm  (z)",
              )}
            </Text>
          )}
        </GridItem>
        {multiChoiceData &&
          multiChoiceData.length > 0 &&
          multiChoiceData.map((q) => (
            <GridItem
              backgroundColor='white'
              border='1px'
              borderColor='gray.200'
              borderRadius={8}
              colSpan={2}
              p={4}>
              <VStack w='100%' h='100%'>
                <Text>{q.prompt}</Text>
                <HStack w='100%' h='100%'>
                  <VStack h='100%' flexGrow={0}>
                    {q.options.map((o) => (
                      <Text key={`${q.id}-${o.label}`}>{o.label}</Text>
                    ))}
                  </VStack>
                  <VStack flexGrow={1} h='100%'>
                    {q.options.map((o) => (
                      <Box
                        key={`${q.id}-${o.x}`}
                        w='100%'
                        flexGrow={1}
                        position='relative'>
                        <Progress
                          borderRadius={2}
                          h='100%'
                          colorScheme='purple'
                          min={0}
                          max={q.responses_aggregate.aggregate?.count ?? 0}
                          value={o.x ?? 0}
                        />
                        <Box
                          position='absolute'
                          right={0}
                          top={0}
                          px={2}
                          borderRadius={2}
                          bg='darkAlpha.100'
                          color='white'
                          fontWeight='bold'>
                          {o.x}
                        </Box>
                      </Box>
                    ))}
                  </VStack>
                </HStack>
              </VStack>
            </GridItem>
          ))}
      </Grid>
      <SurveyResultsList />
    </Box>
  ) : (
    <Box px={2}>Survey Not Found</Box>
  );
};
