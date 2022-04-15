import { LayoutDashboard } from '~/components/backtalk/LayoutDashboard';
import { NextPage } from 'next';
import { SurveyForm } from '~/components/backtalk/survey/SurveyForm';
import { BacktalkSurveyFormContextProvider } from '~/components/context/BacktalkSurveyForm';
import AuthCookieRequired from '~/components/access/AuthCookieRequired';
import BacktalkLogin from '~/components/access/BacktalkLogin';
import { Button } from '@chakra-ui/react';

const CreateSurveyPage: NextPage = () => {
  return (
    <LayoutDashboard>
      <AuthCookieRequired
        isBacktalk
        fallback={
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
        }>
        <BacktalkSurveyFormContextProvider id={null}>
          <SurveyForm />
        </BacktalkSurveyFormContextProvider>
      </AuthCookieRequired>
    </LayoutDashboard>
  );
};

export default CreateSurveyPage;
