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
import NextImage from 'next/image';
import BacktalkLogo from 'src/assets/images/backtalk-logo.svg';
import AwwRatsLogo from '~/assets/images/aww-rats-logo.png';
import Login from 'common/components/access/Login';
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
            height='40'
            src={BacktalkLogo}
            width='200'
          />
          <Spacer />
          <Login login />
        </Flex>
      </Flex>

      <Grid
        alignItems='center'
        maxW='6xl'
        mx='auto'
        mb={12}
        templateColumns={{ base: 'repeat(1, 1fr)', lg: 'repeat(2, 1fr)' }}
        px={4}
        pt={{ base: 20, lg: 24 }}
        gap={8}>
        <GridItem fontSize='2xl'>
          <Heading my={4} size='2xl' lineHeight='1.3' fontWeight='900'>
            The Web3 Community Feedback Tool
          </Heading>
          <Text mb={4}>
            Get feedback you can trust from validated members of your community.
          </Text>
          <Login login />
        </GridItem>
        <GridItem p={8}>
          <NextImage
            alt='Illustration of feedback from an NFT audience.'
            height='100%'
            layout='responsive'
            src='/images/screenshot-homepage.png'
            width='100%'
          />
        </GridItem>
      </Grid>

      <Box background='gray.700'>
        <Box maxW='6xl' mx='auto' px={4} py={12}>
          <VStack mb={4} color='gray.100' fontSize='lg'>
            <Text>Used by communities like:</Text>
          </VStack>

          <Grid
            templateColumns={{ base: 'repeat(1, 1fr)', lg: 'repeat(2, 1fr)' }}
            gap={12}
            mb={4}>
            <GridItem alignSelf='center'></GridItem>
            <GridItem alignSelf='center'>
              <NextImage
                src={AwwRatsLogo}
                alt='Aww, Rats! Logo'
                placeholder='blur'
              />
            </GridItem>
            <GridItem alignSelf='center'></GridItem>
          </Grid>
        </Box>
      </Box>

      <Box maxW='6xl' mx='auto' pb={8}>
        <VStack align='left' my={16} mx={4} spacing={8}>
          <Heading textAlign='center' mb={4} size='xl'>
            Get feedback and make decisions
          </Heading>

          <PromoUnit
            imgAlt='A survey asking people how long they have been collecting NFTs'
            imgSrc='/images/screenshot-general.png'
            title='Get Verified feedback'>
            <Text>
              Make sure that the feedback you&apos;re getting from your
              community is actually coming from your community.
            </Text>
          </PromoUnit>

          <PromoUnit
            bgcolor='white'
            imgAlt='A survey asking people to enter their wallet address for a presale'
            imgSrc='/images/screenshot-presale.png'
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
            imgSrc='/images/screenshot-doa-lite.png'
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

          <Grid
            templateColumns={{ base: 'repeat(1, 1fr)', lg: 'repeat(2, 1fr)' }}
            gap={8}>
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
