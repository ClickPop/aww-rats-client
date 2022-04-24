import { Box, Button, Center, Text, Link, VStack } from '@chakra-ui/react';
import React, { FC, useContext, useEffect, useMemo, useState } from 'react';
import { Emoji } from '~/components/shared/Emoji';
import { SurveyQuestionStepper } from '~/components/backtalk/survey/SurveyQuestionStepper';
import { backtalkNewResponseContext } from '~/components/context/BacktalkNewResponse';
import { EthersContext } from '~/components/context/EthersContext';
import { ethers } from 'ethers';
import { getCommonABI } from '~/utils/getCommonABI';
import { ERC721 } from '~/types';
import BacktalkLogin from '~/components/access/BacktalkLogin';
import { useConnect } from '~/hooks/useConnect';
import { Supported_Chains_Enum } from '~/schema/generated';
import { CHAIN_ID, ETH_CHAIN_ID } from '~/config/env';
import { Image } from '~/components/shared/Image';
import BacktalkLogo from 'src/assets/images/backtalk/backtalk-icon.svg';

export const SurveyResponse: FC = () => {
  const {
    surveyFetchState: { loading, error },
    surveyResponseData: data,
    surveyResponseDispatch,
  } = useContext(backtalkNewResponseContext);
  const { connected, isLoggedInBacktalk, signerAddr, provider, network } =
    useContext(EthersContext);

  const { switchAddNetwork } = useConnect();
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
  const changeNetwork = useMemo(() => {
    if (network?.chainId) {
      switch (data.contract?.chain) {
        case Supported_Chains_Enum.Ethereum:
          if (network.chainId !== ETH_CHAIN_ID) {
            return Supported_Chains_Enum.Ethereum;
          }
          break;
        case Supported_Chains_Enum.Polygon:
          if (network.chainId !== CHAIN_ID) {
            return Supported_Chains_Enum.Polygon;
          }
          break;
      }
    }
    return null;
  }, [data.contract?.chain, network?.chainId]);
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

  if (loading && data.id === -1) {
    return <Center h='100%'>Loading</Center>;
  }

  if (balData.loading) {
    return <Center h='100%'>Checking Token Balance...</Center>;
  }

  if (data.id === -1) {
    return <Center>Survey Not Found</Center>;
  }

  if (balData.error) {
    return <Center>You don&apos;t hold enough tokens!</Center>;
  }

  if (
    typeof data?.response_count === 'number' &&
    typeof data?.max_responses === 'number' &&
    data?.response_count >= data?.max_responses
  ) {
    return (
      <VStack>
        <Image src={BacktalkLogo} alt='BacktalkLogo' height={38} width={52} />
        <Text as='h1' mb={2} fontSize='xl' fontWeight='700'>
          Uh oh! You&apos;re NGMI
        </Text>
        <Text textAlign='center' fontSize='lg' pb={4}>
          This survey already has the maximum number&nbsp;of&nbsp;responses.
        </Text>
        <Text textAlign='center' fontSize='lg'>
          Want to make a web3 survey of your own?
        </Text>
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
      </VStack>
    );
  }

  if (!!changeNetwork) {
    return (
      <Button
        colorScheme={'purple'}
        onClick={() => {
          switchAddNetwork(changeNetwork);
        }}>
        Switch to {changeNetwork}
      </Button>
    );
  }

  if (surveyEnd) {
    return (
      <>
        <Text as='h1' mb={2} fontSize='xl' fontWeight='700'>
          Woo-hoo! <Emoji aria-label='Party'>🎉</Emoji>
        </Text>
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
      <Text as='h1' mb={2} fontSize='xl' fontWeight='700'>
        {data.title}
      </Text>
      {data.step < 0 ? (
        <Box>
          <Text
            isTruncated
            maxWidth='60%'
            fontSize='xs'
            fontWeight='bold'
            color='purple.200'
            mb={4}>
            Created by{' '}
            <Link
              href={
                data?.contract?.chain == 'ethereum'
                  ? 'https://etherscan.io/address/' + data.owner
                  : 'https://polygonscan.com/address/' + data.owner
              }
              isExternal>
              {data.owner}
            </Link>
          </Text>
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
