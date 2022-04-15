import { LayoutSurvey } from '~/components/backtalk/LayoutSurvey';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { SurveyResponse } from '~/components/backtalk/survey/SurveyResponse';
import { BacktalkNewResponseContextProvider } from '~/components/context/BacktalkNewResponse';
import { SurveyWrapper } from '~/components/backtalk/survey/SurveyWrapper';

const SurveyPage: NextPage = () => {
  const { query } = useRouter();
  const surveyId = typeof query.id === 'string' ? parseInt(query.id, 10) : null;

  return (
    <>
      <Head>
        <title>SURVEY_TITLE</title>
        <meta property='og:title' content='SURVEY_TITLE' key='ogtitle' />
        <meta
          property='og:description'
          content='SURVEY_DESCRIPTION'
          key='ogdescription'
        />
        <meta
          property='og:image'
          content='/backtalk/images/og-image.png'
          key='ogimage'
        />
        <meta property='og:url' content='SURVEY_URL' key='ogurl' />

        <meta name='twitter:card' content='summary' key='twcard' />
      </Head>
      <LayoutSurvey>
        <BacktalkNewResponseContextProvider id={surveyId}>
          <SurveyWrapper>
            <SurveyResponse />
          </SurveyWrapper>
        </BacktalkNewResponseContextProvider>
      </LayoutSurvey>
    </>
  );
};

export default SurveyPage;
