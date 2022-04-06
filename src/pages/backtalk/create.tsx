import { LayoutDashboard } from '~/components/backtalk/LayoutDashboard';
import { NextPage } from 'next';
import { SurveyForm } from '~/components/backtalk/survey/SurveyForm';
import { BacktalkSurveyFormContextProvider } from '~/components/context/BacktalkSurveyForm';

const CreateSurveyPage: NextPage = () => {
  return (
    <LayoutDashboard>
      <BacktalkSurveyFormContextProvider id={null}>
        <SurveyForm />
      </BacktalkSurveyFormContextProvider>
    </LayoutDashboard>
  );
};

export default CreateSurveyPage;
