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
} from '@chakra-ui/react';
import { format } from 'date-fns';
import React, { FC, useContext } from 'react';
import { SurveyResultsList } from '~/components/backtalk/results/SurveyResultsList';
import { BacktalkSurveyResultContext } from '~/components/context/BacktalkSurveyResults';
import { apolloBacktalkClient } from '~/lib/graphql';
import { useUpdateSurveyMutation } from '~/schema/generated';

export const SurveyResults: FC = () => {
  const {
    surveyResult: { data, refetch },
    responseCount,
    latestResponse,
  } = useContext(BacktalkSurveyResultContext);

  const [updateSurvey, { loading }] = useUpdateSurveyMutation({
    client: apolloBacktalkClient,
  });

  return data?.surveys_by_pk ? (
    <>
      <Flex align='baseline' my={4}>
        <Heading size='md'>{data.surveys_by_pk.title}</Heading>
        <Spacer />
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
        <Button disabled colorScheme='teal' ml={2} size='sm'>
          Export
        </Button>
      </Flex>

      <Grid gap={4} templateColumns='repeat(2, 1fr)'>
        <GridItem
          backgroundColor='white'
          border='1px'
          borderColor='gray.200'
          borderRadius={8}
          mb={4}
          p={4}>
          <Heading as='h2' color='gray.500' size='sm'>
            Responses
          </Heading>
          <Text fontSize='xl'>
            {!!data.surveys_by_pk.max_responses
              ? `${responseCount}/${data.surveys_by_pk.max_responses}`
              : responseCount}
          </Text>
          {!!data.surveys_by_pk.max_responses && (
            <Progress
              value={responseCount}
              max={data.surveys_by_pk.max_responses}
            />
          )}
        </GridItem>

        <GridItem
          backgroundColor='white'
          border='1px'
          borderColor='gray.200'
          borderRadius={8}
          mb={4}
          p={4}>
          <Heading as='h2' color='gray.500' size='sm'>
            Last Response
          </Heading>
          <Text fontSize='xl'>
            {format(
              new Date(latestResponse.toISOString()),
              "eeee, MMMM d, yyyy 'at' H:mm  (z)",
            )}
          </Text>
        </GridItem>
      </Grid>
      <SurveyResultsList />
    </>
  ) : (
    <Box>Survey Not Found</Box>
  );
};
