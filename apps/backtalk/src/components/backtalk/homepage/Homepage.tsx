import React from 'react';
import {
  Box,
  Button,
  Center,
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
import Pool from '~/assets/svg/backtalk-hero/pool.svg';
import Stairs from '~/assets/svg/backtalk-hero/illustration.svg';
import Critters from '~/assets/svg/backtalk-critters.svg';
import { ArrowDownIcon } from '@chakra-ui/icons';

const Homepage = () => {
  return (
    <Box
      scrollSnapType='y mandatory'
      overflowY='scroll'
      scrollBehavior='smooth'
      fontFamily='Work Sans'
      backgroundColor='homepage.background'
      h='100vh'>
      <Box
        scrollSnapAlign='start'
        overflow='hidden'
        position='relative'
        w='100vw'
        h='100vh'
        maxW='1700px'
        mx='auto'>
        <Flex
          position='absolute'
          width='100%'
          zIndex='100'
          alignItems='end'
          justifyContent='space-between'
          pt='4'
          px='12'>
          <Heading
            fontFamily='Space Grotesk'
            fontWeight={500}
            fontSize='2rem'
            color='homepage.blue'>
            Backtalk
          </Heading>
          <Login login />
        </Flex>
        <Center
          color='homepage.blue'
          border='2px #3E464E solid'
          position='absolute'
          w='100%'
          h='4rem'
          bottom='0'
          backgroundColor='white'>
          <ArrowDownIcon boxSize='1.5rem' />
          <Text mx='2' fontSize='1.5rem'>
            Dip In
          </Text>
          <ArrowDownIcon boxSize='1.5rem' />
        </Center>
        <Box h='430px' w='1270px' position='absolute' bottom='1.25rem'>
          <Pool style={{ width: '100%', height: '100%' }} />
        </Box>
        <Box h='815px' w='700px' position='absolute' right='0' bottom='2rem'>
          <Stairs style={{ width: '100%', height: '100%' }} />
        </Box>
        <Box mt='32' ml='24'>
          <Heading
            fontSize='3.25rem'
            color='homepage.blue'
            fontFamily='Space Grotesk'>
            The Web3 Community <br /> Feedback Tool
          </Heading>
          <Text fontSize='1.25rem' my='4'>
            Get Insights from validated <br /> members of your community.
          </Text>
          <Login login />
        </Box>
        <Box
          as='a'
          href='#info'
          w='100%'
          h='4rem'
          bottom='0'
          position='absolute'></Box>
      </Box>

      <Box
        id='info'
        scrollSnapAlign='start'
        overflow='hidden'
        position='relative'
        w='100vw'
        h='100vh'
        maxW='1700px'
        mx='auto'>
        <Flex w='100%' h='100%'>
          <Flex flexDir='column' w='50%' h='100%' backgroundColor='white'>
            <Box
              border='2px #3E464E solid'
              px='4rem'
              py='1.5rem'
              borderTop='none'>
              <Heading
                fontFamily='Space Grotesk'
                color='homepage.blue'
                fontSize='2.5rem'
                mb='1.5rem'>
                What is Backtalk?
              </Heading>
              <Text fontSize='1.25rem' mb='1rem'>
                Web3 is all about building relationships. It’s a space where
                security & privacy are paramount.
              </Text>
              <Text fontSize='1.25rem'>
                Backtalk is the best way to collect community feedback and move
                ideas forward in a secure, streamlined way.
              </Text>
            </Box>
            <Box border='2px #3E464E solid' borderTop='none' overflowY='hidden'>
              <Box px='4rem' py='1.5rem'>
                <Heading
                  fontFamily='Space Grotesk'
                  fontSize='2rem'
                  color='homepage.blue'
                  mb='1.5rem'>
                  Coming Soon...
                </Heading>
                <UnorderedList spacing={4} fontSize='1.25rem'>
                  <ListItem>
                    Capture the amount of tokens a respondent has when they
                    responded.
                  </ListItem>
                  <ListItem>Limit participation to specific wallets.</ListItem>
                  <ListItem>
                    Associate feedback with the number of tokens someone has to
                    understand what your superfans are thinking.
                  </ListItem>
                </UnorderedList>
              </Box>
              <Box>
                <Critters style={{ width: '100%' }} />
              </Box>
            </Box>
          </Flex>
          <Flex
            gap={8}
            alignItems='center'
            justifyContent='space-evenly'
            flexDir='column'
            w='50%'
            h='100%'
            py='1rem'
            px='2.5rem'>
            <Heading
              fontFamily='Space Grotesk'
              color='homepage.blue'
              fontSize='2rem'>
              Features
            </Heading>
            <PromoUnit
              imgAlt='A survey asking people how long they have been collecting NFTs'
              imgSrc='/images/screenshot-general.png'
              title='Get Verified feedback'>
              <Text fontFamily='Work Sans' fontSize='1rem'>
                Make sure that the feedback you&apos;re getting from your
                community is actually coming from your community.
              </Text>
            </PromoUnit>
            <PromoUnit
              bgcolor='white'
              imgAlt='A survey asking people to enter their wallet address for a presale'
              imgSrc='/images/screenshot-presale.png'
              title='Pre-sale List Building'>
              <Text fontFamily='Work Sans' fontSize='1rem'>
                Gather wallet addresses from interested people to help your new
                project launch with momentum.
              </Text>
            </PromoUnit>
            <PromoUnit
              bgcolor='white'
              imgAlt='A survey asking people to connect their wallet to verify their response'
              imgSrc='/images/screenshot-doa-lite.png'
              title='DIY DAO-lite'>
              <Text fontFamily='Work Sans' fontSize='1rem'>
                Give your community voting weight on ideas and initiatives based
                on the tokens they own.
              </Text>
            </PromoUnit>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
};

export default Homepage;
