import { Box, Button, Center, Heading, Text } from '@chakra-ui/react';
import React, { FC, useContext, useEffect, useMemo, useState } from 'react';
import { Link } from '~/components/shared/Link';
import { Emoji } from '~/components/shared/Emoji';
import { SurveyQuestionStepper } from '~/components/backtalk/survey/SurveyQuestionStepper';
import { backtalkNewResponseContext } from '~/components/context/BacktalkNewResponse';
import { EthersContext } from '~/components/context/EthersContext';
import { ethers } from 'ethers';
import { getCommonABI } from '~/utils/getCommonABI';
import { ERC721 } from '~/types';
import BacktalkLogin from '~/components/access/BacktalkLogin';

export const SurveyResponse: FC = () => {
  const {
    surveyFetchState: { loading, error },
    surveyResponseData: data,
    surveyResponseDispatch,
  } = useContext(backtalkNewResponseContext);
  const { connected, isLoggedInBacktalk, signerAddr, provider } =
    useContext(EthersContext);

  useEffect(() => {
    if (
      data?.callerResponses.length > 0 &&
      data.step !== data.questions.length + 1
    ) {
      surveyResponseDispatch({
        type: 'endSurvey',
      });
    }
  }, [data, surveyResponseDispatch]);

  const surveyEnd = data.step === data?.questions?.length + 1;

  const [balData, setBalData] = useState({ loading: false, error: false });

  useEffect(() => {
    const getBal = async () => {
      if (
        data.contract?.address &&
        data.contract.token_type &&
        provider &&
        signerAddr &&
        isLoggedInBacktalk
      ) {
        setBalData((bd) => ({ ...bd, loading: true }));
        try {
          const contract = new ethers.Contract(
            data.contract.address,
            getCommonABI(data.contract.token_type),
            provider,
          ) as ERC721;
          const bal = await contract.balanceOf(signerAddr);
          setBalData((bd) => ({ ...bd, error: bal.lt(1) }));
        } catch (err) {
          console.error(err);
        }
        setBalData((bd) => ({ ...bd, loading: false }));
      }
    };

    getBal();
  }, [data.contract, isLoggedInBacktalk, provider, signerAddr]);

  if (loading || balData.loading) {
    return <Center h='100%'>Loading</Center>;
  }

  if (data.id === -1) {
    return <Center>Survey Not Found</Center>;
  }

  if (balData.error) {
    return <Center>You don&apos;t hold enough tokens!</Center>;
  }

  if (surveyEnd) {
    return (
      <>
        <Heading as='h1' mb={2} size='md'>
          Woo-hoo! <Emoji aria-label='Party'>🎉</Emoji>
        </Heading>
        <Text mb={2}>Thanks so much for your feedback for {data.title}.</Text>
        <Text>Want to make a web3 survey of your own?</Text>
        <Link href='/backtalk'>
          <Button
            colorScheme='gray'
            mt={4}
            size='md'
            variant='outline'
            _hover={{
              backgroundColor: 'gray.200',
              color: 'black',
            }}>
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
          {connected && isLoggedInBacktalk ? (
            <Button
              colorScheme='gray'
              mt={4}
              size='md'
              variant='outline'
              width='100%'
              _hover={{
                backgroundColor: 'gray.200',
                color: 'black',
              }}
              onClick={() => surveyResponseDispatch({ type: 'startSurvey' })}>
              <Emoji mr='0.5ch' aria-label='Right Arrow'>
                {' '}
                ➡️{' '}
              </Emoji>{' '}
              Start
            </Button>
          ) : (
            <BacktalkLogin>
              <Button
                colorScheme='gray'
                mt={4}
                size='md'
                variant='outline'
                width='100%'
                _hover={{
                  backgroundColor: 'gray.200',
                  color: 'black',
                }}
                isLoading={loading}>
                <Emoji mr='0.5ch' aria-label='Electrical Plug'>
                  🔌{' '}
                </Emoji>{' '}
                Connect
              </Button>
            </BacktalkLogin>
          )}
        </Box>
      ) : (
        <SurveyQuestionStepper />
      )}
    </>
  );
};
