import { LayoutDashboard } from '~/components/backtalk/LayoutDashboard';
import { NextPage } from 'next';
import { BacktalkSurveyFormContextProvider } from '~/components/context/BacktalkSurveyForm';
import AuthCookieRequired from 'common/components/access/AuthCookieRequired';
import Login from 'common/components/access/Login';
import SurveyForm from '~/components/backtalk/survey/SurveyForm';

const CreateSurveyPage: NextPage = () => {
  return (
    <LayoutDashboard>
      <AuthCookieRequired fallback={<Login login />}>
        <BacktalkSurveyFormContextProvider id={null}>
          <SurveyForm />
        </BacktalkSurveyFormContextProvider>
      </AuthCookieRequired>
    </LayoutDashboard>
  );
};

export default CreateSurveyPage;
