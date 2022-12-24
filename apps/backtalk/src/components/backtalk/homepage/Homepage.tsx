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
  position,
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
import pool from './images/Pool.png';
import wall from './images/wall.png';
import wall2 from './images/wall2.png'
import dw from './images/Doorway.png';
import shadow from './images/shadow.png';
import purpcrit from './images/Critter & float.png';
import orcrit from './images/Orange critter.png';
import greencrit from './images/Green critter.png';
import grouped from './images/group.png';
import purpcrit2 from './images/Purple Critter.png';
import newpool from './images/Poolnew.svg';
import wallgroup from './images/WallGroup.svg';
// import 'src/styles/index.css';
import {Global} from '@emotion/react'
import { extendTheme } from '@chakra-ui/react'
import { relative } from 'path';


const Homepage = () => {
  return (
    
      
    
    <Box backgroundColor='#CDDBE9' w='full' bottom='0' height='100%'
    >
    
    
      {/* <img src={pool.src} alt = "pool"/> */}
      
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
          
        </Flex>
      </Flex>
      <div style = {{position:'absolute', top: '448px', left: '200px'}}>
          <Login login />
          </div>
      <div style = {{position:'absolute', top: '618px', left: '-10px', width: 1800}}>
      <NextImage src = {newpool}/>
      </div>
      <div style = {{position:'relative', top: '65px', left: '1110px', width: 805}}>
      <NextImage src = {wallgroup} />
      </div>
      {/* <div style = {{position:'absolute', top: '109px', marginLeft: '1378px'}}>
      <NextImage src = {wall2}  width = '375px' height='492px'/>
      </div>
      <div style = {{position:'absolute', top: '122px', marginLeft:'1377px'}}>
      <NextImage src = {dw}  width = '375px' height='482px'/>
      </div>
      <div style = {{position:'absolute', bottom: '278px',marginLeft:'1455px'}}>
      <NextImage src = {shadow}  width = '150px' height='120px'/>
      </div>
      <div style = {{position:'absolute', top: '235px', marginLeft:'1392px'}}>
      <NextImage src = {purpcrit}  width = '260px' height='350px'/>
      </div>
      <div style = {{position:'absolute', top: '410px', marginLeft:'1662.1px'}}>
      <NextImage src = {orcrit}  width = '93px' height='170px'/>
      </div>
      <div style = {{position:'relative', top: '572px', left:'1100px', marginRight:'1003px'}}>
      <NextImage src = {greencrit}  width = '342px' height='326px'/>
      </div> */}

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
          <div style = {{position:'absolute', bottom: '500px', left:'200px', marginRight:'503px'}}>
          <Heading my={4} size='2xl' lineHeight='1.3' fontWeight='900' fontFamily='Space Grotesk' color='#0500FF;
'>
            The Web3 Community <br/>Feedback Tool
          </Heading>
          <Text>
          Get Insights from validated members of your community.

            </Text>
          </div>
          
          {/* <Login login /> */}
        </GridItem>
        {/* <GridItem p={8}>
          <NextImage
            alt='Illustration of feedback from an NFT audience.'
            height='100%'
            layout='responsive'
            src='/images/screenshot-homepage.png'
            width='100%'
          />
        </GridItem> */}
      </Grid>

      {/* <Box background='gray.700'>
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
      </Box> */}

      <Box maxW='6xl' mx='auto' pb={8}>
        <VStack h='full' >
          {/* <Heading textAlign='center' mb={4} size='xl'>
            Get feedback and make decisions
          </Heading> */}

          <PromoUnit
            imgAlt='A survey asking people how long they have been collecting NFTs'
            title='What is Backtalk?'
            style={{width:'950px', position:'absolute', top: '937px', marginRight:'955px',backgroundColor:'#FFFFFF',border: '1px solid black'}}
            >
            
            <Text>
            Web3 is all about building relationships. It’s  a space where security & privacy are paramount. 

            Backtalk is the best way to collect community feedback and move ideas forward in a secure, streamlined way.

            </Text>
          </PromoUnit>
          <PromoUnit
            imgAlt='A survey asking people how long they have been collecting NFTs'
            title='Coming soon...'
            style={{width:'950px', position:'absolute', top: '1168px', marginRight:'955px', height:'480px', backgroundColor:'#FFFFFF', border: '1px solid black'}}
            >
            
            <Text>
            <ul>
            <li>Capture the amount of tokens a respondent has when they responded.</li>
            <li>Limit participation to specific wallets.</li>
            <li>Associate feedback with the number of tokens someone has to understand what your superfans are thinking.</li>
          </ul>
            





            </Text>
            
            <div style = {{position:'absolute', top: '238px', left:'0px'}}>
            <NextImage src = {grouped}  width = '340px' height='220px'/>
            </div>
            <div style = {{position:'absolute',marginRight:'0px',top: '238px', left:'513px'}}>
            <NextImage src = {purpcrit2}  width = '370px' height='220px'/>
            </div>
          </PromoUnit>
          
          {/* <PromoUnit
            imgAlt='A survey asking people how long they have been collecting NFTs'
            title='Coming Soon...'
            style={{width:'600px', position:'relative', right:'260px', height: '300px'}}
            >
            
            <Text>
            Capture the amount of tokens a respondent has when they responded.

          Limit participation to specific wallets.

          Associate feedback with the number of tokens someone has to understand what your superfans are thinking.
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
          </PromoUnit> */}
          <Heading position='relative' bottom='4428px' left='420px' fontSize='25px'>
            Features
          </Heading>
          <PromoUnit
            bgcolor='backtalk.blue'
            color='red'
            imgAlt='A survey asking people to connect their wallet to verify their response'
            imgSrc='/images/screenshot-doa-lite.png'
            title='DIY DAO-lite'
             style={{width:'420px', position:'relative', fontSize: '20%', top: '170px', marginLeft:'950px', height:'160px', backgroundColor:'#FFFFFF', border: '1px solid black'}}>
              
            <Text color='red'>
              Give your community voting weight on ideas and initiatives based
              on the tokens they own.
            </Text>
          </PromoUnit>
          <PromoUnit
            bgcolor='white'
            imgAlt='A survey asking people to enter their wallet address for a presale'
            imgSrc='/images/screenshot-presale.png'
            title='Pre-sale List Building'
            style={{width:'620px', position:'relative', top: '180px', marginLeft:'950px', height:'280px',  backgroundColor:'#FFFFFF', border: '1px solid black'}}>
            <Text>
              Gather wallet addresses from interested people to help your new
              project launch with momentum.
            </Text>
          </PromoUnit>
          <PromoUnit
            bgcolor='white'
            imgAlt='A survey asking people to enter their wallet address for a presale'
            imgSrc='/images/screenshot-general3.png'
            title='Verified Feedback'
            style={{width:'600px', position:'relative', top: '428px', marginLeft:'850px', height:'280px',  backgroundColor:'#FFFFFF', border: '1px solid black'}}>
            <Text>
            Make sure that the feedback you're getting is actually coming from your community.
            </Text>
          </PromoUnit>

          
        </VStack>
          
        {/* <VStack align='left' spacing={8} my={16} mx={4}>
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
        </VStack> */}
      </Box>
    </Box>
  );
};

export default Homepage;
