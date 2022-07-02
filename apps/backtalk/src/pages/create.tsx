import { LayoutDashboard } from '~/components/backtalk/LayoutDashboard';
import { NextPage } from 'next';
import { SurveyForm } from '~/components/backtalk/survey/SurveyForm';
import { BacktalkSurveyFormContextProvider } from '~/components/context/BacktalkSurveyForm';
import AuthCookieRequired from 'common/components/access/AuthCookieRequired';
import Login from 'common/components/access/Login';
import { useCreateSurveyMutation } from '~/schema/generated';
import CreateSurveyForm from '~/components/backtalk/survey/CreateSurvey';

const CreateSurveyPage: NextPage = () => {
  return (
    <LayoutDashboard>
      <AuthCookieRequired fallback={<Login login />}>
        <BacktalkSurveyFormContextProvider id={null}>
          <CreateSurveyForm />
        </BacktalkSurveyFormContextProvider>
      </AuthCookieRequired>
    </LayoutDashboard>
  );
};

export default CreateSurveyPage;
