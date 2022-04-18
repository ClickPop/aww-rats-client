import React from 'react';
import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  List,
  ListItem,
  Spacer,
  Text,
  UnorderedList,
  VStack,
} from '@chakra-ui/react';
import NextImage, { ImageProps } from 'next/image';
import BacktalkLogo from 'src/assets/images/backtalk/backtalk-chunky.svg';
import Characters from 'src/assets/images/backtalk/characters.png';
import AwwRatsLogo from '~/assets/images/aww-rats-logo.png';
import BacktalkLogin from '~/components/access/BacktalkLogin';
import { PromoUnit } from '~/components/backtalk/homepage/PromoUnit';

const Homepage = () => {
  return (
    <Box backgroundColor='backtalk.background' minH='100vh'>
      <Flex
        backgroundColor='backtalk.background'
        borderBottom='1px'
        borderColor='darkAlpha.50'
        position='fixed'
        width='100%'
        zIndex='100'>
        <Flex alignItems='end' mx='auto' p={2} pb={4} width='6xl'>
          <NextImage
            alt='Backtalk'
            height='50'
            src={BacktalkLogo}
            width='200'
          />
          <Spacer />
          <BacktalkLogin>
            <Button
              background='linear-gradient(-45deg, var(--chakra-colors-pink-500), var(--chakra-colors-red-500), var(--chakra-colors-blue-500), var(--chakra-colors-purple-500))'
              backgroundSize='600% 400%'
              color='white'
              _hover={{
                animation: 'encounterShimmer 4s ease infinite;',
              }}>
              Login
            </Button>
          </BacktalkLogin>
        </Flex>
      </Flex>

      <Box>
        <Flex alignItems='center' maxW='6xl' mx='auto' px={4} pt={24}>
          <Box width='50%' fontSize='2xl'>
            <Heading my={4} size='2xl' lineHeight='1.3' fontWeight='900'>
              The Web3 Community Feedback Tool
            </Heading>
            <Text mb={4}>
              Get feedback you can trust from validated members of your
              community.
            </Text>
            <BacktalkLogin>
              <Button
                background='linear-gradient(-45deg, var(--chakra-colors-pink-500), var(--chakra-colors-red-500), var(--chakra-colors-blue-500), var(--chakra-colors-purple-500))'
                backgroundSize='600% 400%'
                color='white'
                _hover={{
                  animation: 'encounterShimmer 4s ease infinite;',
                }}>
                Login
              </Button>
            </BacktalkLogin>
          </Box>
          <Box width='50%' p={8}>
            <img src='/backtalk/images/screenshot-homepage.png' alt='Illustration of feedback from an NFT audience.' />
          </Box>
        </Flex>
      </Box>

      <Box maxW='6xl' mx='auto' pb={8}>
        <VStack mt={12} mb={4}>
          <Text>Used by communities like:</Text>
        </VStack>

        <Grid templateColumns='repeat(3, 1fr)' gap={12} mb={24}>
          <GridItem alignSelf='center'>
          </GridItem>
          <GridItem alignSelf='center'>
            <NextImage
              src={AwwRatsLogo}
              alt='Aww, Rats! Logo'
              placeholder='blur'
            />
          </GridItem>
          <GridItem alignSelf='center'>
          </GridItem>
        </Grid>

        <VStack align='left' my={16} mx={4} spacing={8}>
          <Heading textAlign='center' mb={4} size='xl'>
            Get feedback and make decisions
          </Heading>

          <PromoUnit
            imgAlt='A survey asking people how long they have been collecting NFTs'
            imgSrc='/backtalk/images/screenshot-general.png'
            title='Get Verified feedback'
          >
            <Text>
              Make sure that the feedback you&apos;re getting from your
              community is actually coming from your community.
            </Text>
          </PromoUnit>

          <PromoUnit
            bgcolor='white'
            imgAlt='A survey asking people to enter their wallet address for a presale'
            imgSrc='/backtalk/images/screenshot-presale.png'
            title='Pre-sale List Building'>
            <Text>
              Gather wallet addresses from interested people to help your new
              project launch with momentum.
            </Text>
          </PromoUnit>

          <PromoUnit
            bgcolor='backtalk.blue'
            color='white'
            imgAlt='A survey asking people to connect their wallet to verify their response'
            imgSrc='/backtalk/images/screenshot-doa-lite.png'
            title='DIY DAO-lite'>
            <Text>
              Give your community voting weight on ideas and initiatives based
              on the tokens they own.
            </Text>
          </PromoUnit>
        </VStack>

        <VStack align='left' spacing={8} my={16} mx={4}>
          <Heading textAlign='center' mb={2} size='xl'>
            Useful features
          </Heading>

          <Grid templateColumns='repeat(2, 1fr)' gap={8}>
            <GridItem>
              <PromoUnit
                bgcolor='backtalk.red'
                color='white'
                title='Get feedback from verified holders'>
                <List>
                  <UnorderedList>
                    <ListItem>
                      Tie responses back to wallet addresses and token holders.
                    </ListItem>
                    <ListItem>
                      Get to know your community over time by seeing all of the
                      survey responses over time with a wallet.
                    </ListItem>
                    <ListItem>
                      <strong>Coming soon:</strong> Capture the amount of tokens
                      a respondent has when they responded.
                    </ListItem>
                  </UnorderedList>
                </List>
              </PromoUnit>
            </GridItem>

            <GridItem>
              <PromoUnit
                bgcolor='white'
                title='Lock Surveys to Specific People'>
                <List>
                  <UnorderedList>
                    <ListItem>
                      Limit surveys to holders of tokens on specific contracts.
                    </ListItem>
                    <ListItem>
                      Cap the number of responses for things like POAPs,
                      pre-sales, etc.
                    </ListItem>
                    <ListItem>
                      <strong>Coming soon:</strong> Limit participation to
                      specific wallets.
                    </ListItem>
                  </UnorderedList>
                </List>
              </PromoUnit>
            </GridItem>
          </Grid>

          <PromoUnit bgcolor='white' title='Easily Explore Community Feedback'>
            <List>
              <UnorderedList>
                <ListItem>
                  Clear and simple reports make it easy to see what your
                  community is thinking as a group, and then dive in to see
                  which individuals have specific feedback.
                </ListItem>
                <ListItem>
                  <strong>Coming soon:</strong> Associate feedback with the
                  number of tokens someone has to understand what your superfans
                  are thinking.
                </ListItem>
              </UnorderedList>
            </List>
          </PromoUnit>
        </VStack>
      </Box>
    </Box>
  );
};

export default Homepage;
