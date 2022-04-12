import { LayoutDashboard } from '~/components/backtalk/LayoutDashboard';
import { NextPage } from 'next';
import { SurveyForm } from '~/components/backtalk/survey/SurveyForm';
import { BacktalkSurveyFormContextProvider } from '~/components/context/BacktalkSurveyForm';
import AuthCookieRequired from '~/components/access/AuthCookieRequired';
import BacktalkLogin from '~/components/access/BacktalkLogin';

const CreateSurveyPage: NextPage = () => {
  return (
    <LayoutDashboard>
      <AuthCookieRequired isBacktalk fallback={<BacktalkLogin />}>
        <BacktalkSurveyFormContextProvider id={null}>
          <SurveyForm />
        </BacktalkSurveyFormContextProvider>
      </AuthCookieRequired>
    </LayoutDashboard>
  );
};

export default CreateSurveyPage;
