import { LayoutSurvey } from '~/components/backtalk/LayoutSurvey';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { SurveyResponse } from '~/components/backtalk/survey/SurveyResponse';
import { BacktalkNewResponseContextProvider } from '~/components/context/BacktalkNewResponse';
import { SurveyWrapper } from '~/components/backtalk/survey/SurveyWrapper';
import { checkCookie } from '~/lib/session';
import { apolloBacktalkClient } from '~/lib/graphql';
import {
  CheckAuthDocument,
  CheckAuthQueryResult,
  CheckAuthQueryVariables,
  GetSurveyByIdDocument,
  GetSurveyByIdQueryResult,
  GetSurveyByIdQueryVariables,
} from '~/schema/generated';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  let surveyData: null | GetSurveyByIdQueryResult['data'] = null;
  if (ctx.params?.id && typeof ctx.params.id === 'string') {
    try {
      const auth = await apolloBacktalkClient.query<
        CheckAuthQueryResult['data'],
        CheckAuthQueryVariables
      >({
        query: CheckAuthDocument,
        fetchPolicy: 'no-cache',
        context: {
          headers: {
            Cookie: checkCookie(ctx)
              ? `backtalk-wallet=${ctx.req.cookies['backtalk-wallet']}`
              : undefined,
          },
        },
      });

      const res = await apolloBacktalkClient.query<
        GetSurveyByIdQueryResult['data'],
        GetSurveyByIdQueryVariables
      >({
        query: GetSurveyByIdDocument,
        variables: {
          id: Number(ctx.params.id),
          includeMyResponses: !!auth.data?.checkAuth.id,
          wallet: auth.data?.checkAuth.id,
        },
        context: {
          headers: {
            Cookie: checkCookie(ctx)
              ? `backtalk-wallet=${ctx.req.cookies['backtalk-wallet']}`
              : undefined,
          },
        },
      });
      if (res.data) {
        surveyData = res.data;
      }
    } catch (err) {}
  }
  return {
    props: {
      surveyData,
      host: ctx.req.headers.host,
    },
  };
};

type Props = {
  surveyData: null | GetSurveyByIdQueryResult['data'];
  host?: string;
};

const SurveyPage: NextPage<Props> = ({ surveyData, host }) => {
  const { query } = useRouter();
  const surveyId = typeof query.id === 'string' ? parseInt(query.id, 10) : null;
  const { asPath } = useRouter();
  return (
    <>
      <Head>
        <title>{surveyData?.surveys_by_pk?.title ?? 'Backtalk Survey'}</title>
        <meta
          property='og:title'
          content={surveyData?.surveys_by_pk?.title ?? 'Backtalk Survey'}
          key='ogtitle'
        />
        {surveyData?.surveys_by_pk?.description && (
          <meta
            property='og:description'
            content={surveyData.surveys_by_pk.description}
            key='ogdescription'
          />
        )}
        <meta
          property='og:image'
          content='/backtalk/images/og-image.png'
          key='ogimage'
        />
        <meta
          property='og:url'
          content={`https://${host}${asPath}`}
          key='ogurl'
        />

        <meta name='twitter:card' content='summary' key='twcard' />
      </Head>
      <LayoutSurvey>
        <BacktalkNewResponseContextProvider survey={surveyData} id={surveyId}>
          <SurveyWrapper>
            <SurveyResponse />
          </SurveyWrapper>
        </BacktalkNewResponseContextProvider>
      </LayoutSurvey>
    </>
  );
};

export default SurveyPage;
