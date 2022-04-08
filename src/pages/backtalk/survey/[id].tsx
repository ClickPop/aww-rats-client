import { LayoutSurvey } from '~/components/backtalk/LayoutSurvey';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { SurveyResponse } from '~/components/backtalk/survey/SurveyResponse';
import { BacktalkNewResponseContextProvider } from '~/components/context/BacktalkNewResponse';
import { SurveyWrapper } from '~/components/backtalk/survey/SurveyWrapper';

const SurveyPage: NextPage = () => {
  const { query } = useRouter();
  const surveyId = typeof query.id === 'string' ? parseInt(query.id, 10) : null;

  return (
    <LayoutSurvey>
      <BacktalkNewResponseContextProvider id={surveyId}>
        <SurveyWrapper>
          <SurveyResponse />
        </SurveyWrapper>
      </BacktalkNewResponseContextProvider>
    </LayoutSurvey>
  );
};

export default SurveyPage;
