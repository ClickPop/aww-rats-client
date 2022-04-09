import { Box, Button, Heading, Text } from '@chakra-ui/react';
import { LayoutSurvey } from '~/components/backtalk/LayoutSurvey';
import { NextPage } from 'next';
import AuthCookieRequired from '~/components/access/AuthCookieRequired';
import BacktalkLogin from '~/components/access/BacktalkLogin';

const SurveyPage: NextPage = () => {
  return (
    <LayoutSurvey>
      <AuthCookieRequired fallback={<BacktalkLogin />}>
        <Box
          background='purple.800'
          boxShadow='dark-lg'
          borderRadius='xl'
          color='white'
          my={8}
          p={5}>
          <Heading as='h1' mb={2} size='md'>
            The Survey Title
          </Heading>
          <Text mb={4}>
            The description of the survey. This is a short paragraph or so
            describing why this survey exists.
          </Text>
          <Button
            colorScheme='black'
            display='block'
            size='lg'
            variant='outline'
            textAlign='left'
            w='100%'>
            🔌 Connect
          </Button>
        </Box>
      </AuthCookieRequired>
    </LayoutSurvey>
  );
};

export default SurveyPage;
