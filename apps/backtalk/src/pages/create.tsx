import { LayoutDashboard } from '~/components/backtalk/LayoutDashboard';
import { NextPage } from 'next';
import { SurveyForm } from '~/components/backtalk/survey/SurveyForm';
import { BacktalkSurveyFormContextProvider } from '~/components/context/BacktalkSurveyForm';
import AuthCookieRequired from 'common/components/access/AuthCookieRequired';
import BacktalkLogin from 'common/components/access/Login';

const CreateSurveyPage: NextPage = () => {
  return (
    <LayoutDashboard>
      <AuthCookieRequired fallback={<BacktalkLogin login />}>
        <BacktalkSurveyFormContextProvider id={null}>
          <SurveyForm />
        </BacktalkSurveyFormContextProvider>
      </AuthCookieRequired>
    </LayoutDashboard>
  );
};

export default CreateSurveyPage;
