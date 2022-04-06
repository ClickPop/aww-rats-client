import { LayoutSurvey } from '~/components/backtalk/LayoutSurvey';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Survey } from '~/components/backtalk/survey/Survey';
import { BacktalkNewResponseContextProvider } from '~/components/context/BacktalkNewResponse';

const SurveyPage: NextPage = () => {
  const { query } = useRouter();
  const surveyId = typeof query.id === 'string' ? parseInt(query.id, 10) : null;

  return (
    <LayoutSurvey>
      <BacktalkNewResponseContextProvider id={surveyId}>
        <Survey />
      </BacktalkNewResponseContextProvider>
    </LayoutSurvey>
  );
};

export default SurveyPage;
