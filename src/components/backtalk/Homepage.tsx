import React from 'react';
import {
  Box,
  Flex,
  Grid,
  GridItem,
  Heading,
  List,
  ListItem,
  Text,
  UnorderedList,
  VStack,
} from '@chakra-ui/react';
import NextImage, { ImageProps } from 'next/image';
import BacktalkLogo from 'src/assets/images/backtalk/backtalk-chunky.svg';
import Characters from 'src/assets/images/backtalk/characters.png';
import AwwRatsLogo from '~/assets/images/aww-rats-logo.png';
import BacktalkLogin from '~/components/access/BacktalkLogin';

const Homepage = () => {
  return (
    <Box backgroundColor='white' minH='100vh'>
      <Box background='purple.50'>
        <Flex alignItems='center' maxW='4xl' mx='auto' px={8} pt={12}>
          <Box width='50%'>
            <NextImage
              alt='Backtalk'
              height='50'
              src={BacktalkLogo}
              width='200'
            />
            <Heading my={4} size='lg'>
              The Web3 Community Feedback Tool
            </Heading>
            <Text mb={4}>
              Get feedback you can trust from validated members of your
              community.
            </Text>
            <BacktalkLogin />
          </Box>
          <Box width='50%' p={8}>
            <NextImage
              alt='A community of people on the internet'
              src={Characters}
            />
          </Box>
        </Flex>
      </Box>

      <Box maxW='4xl' mx='auto' my={12}>
        <VStack mb={4}>
          <Text>Used by communities like:</Text>
        </VStack>

        <Grid templateColumns='repeat(3, 1fr)' gap={12} mb={12}>
          <GridItem alignSelf='center'>
            <NextImage
              src={AwwRatsLogo}
              alt='Aww, Rats! Logo'
              placeholder='blur'
            />
          </GridItem>
          <GridItem alignSelf='center'>
            <NextImage
              src={AwwRatsLogo}
              alt='Aww, Rats! Logo'
              placeholder='blur'
            />
          </GridItem>
          <GridItem alignSelf='center'>
            <NextImage
              src={AwwRatsLogo}
              alt='Aww, Rats! Logo'
              placeholder='blur'
            />
          </GridItem>
        </Grid>

        <VStack align='left' my={12} spacing={8}>
          <Box>
            <Heading mb={4} size='lg'>
              What can you use Backtalk for?
            </Heading>

            <Heading size='md' mb={2}>
              Get feedback from verified community members.
            </Heading>
            <Text mb={2}>
              Make sure that the feedback you’re getting from your community is
              actually coming from your community.
            </Text>
            <List>
              <UnorderedList>
                <ListItem>
                  Verification ownership of a token on a specific contract.
                </ListItem>
                <ListItem>
                  Run Learn to earn surveys where token holders earn things like
                  airdrops for sharing their perspective.
                </ListItem>
                <ListItem>
                  Associating web2 data with web3 data by asking for email
                  addresses, social handles, etc in your survey.
                </ListItem>
              </UnorderedList>
            </List>
          </Box>

          <Box>
            <Heading size='md' mb={2}>
              Pre-sale List Building
            </Heading>
            <Text mb={2}>
              Gather wallet addresses from interested people to help your new
              project launch with momentum.
            </Text>
            <Text mb={2}>
              This is far better than the current way of building a pre-sale
              list by manually gathering addresses in Discord or Twitter,
              manually updating Discord roles, or creating a .csv of addresses
              by hand (🤮).
            </Text>
          </Box>

          <Box>
            <Heading size='md' mb={2}>
              DAO-lite
            </Heading>
            <Text mb={2}>
              Let your community vote on ideas and initiatives.
            </Text>
            <Text mb={2}>
              A no-code governance token alternative to unlock the value of
              community ownership and decision making without the need for
              engineering or complex token deployment.
            </Text>
          </Box>
        </VStack>

        <VStack align='left' my={12} spacing={8}>
          <Box>
            <Heading mb={4} size='lg'>
              Features
            </Heading>

            <Heading size='md' mb={2}>
              Get feedback from verified community members.
            </Heading>
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
                  <strong>Coming soon:</strong> Capture the amount of tokens a
                  respondent has when they responded.
                </ListItem>
              </UnorderedList>
            </List>
          </Box>

          <Box>
            <Heading size='md' mb={2}>
              Lock Surveys to Specific People.
            </Heading>
            <List>
              <UnorderedList>
                <ListItem>
                  Limit surveys to holders of tokens on specific contracts.
                </ListItem>
                <ListItem>
                  Cap the number of responses for things like POAPs, pre-sales,
                  etc.
                </ListItem>
                <ListItem>
                  <strong>Coming soon:</strong> Limit participation to specific
                  wallets.
                </ListItem>
              </UnorderedList>
            </List>
          </Box>

          <Box>
            <Heading size='md' mb={2}>
              Easily Explore Community Feedback
            </Heading>
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
          </Box>

          <BacktalkLogin />
        </VStack>
      </Box>
    </Box>
  );
};

export default Homepage;
