import { LayoutSurvey } from '~/components/backtalk/LayoutSurvey';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { SurveyResponse } from '~/components/backtalk/survey/SurveyResponse';
import { BacktalkNewResponseContextProvider } from '~/components/context/BacktalkNewResponse';
import { SurveyWrapper } from '~/components/backtalk/survey/SurveyWrapper';
import {
  GetSurveyByIdDocument,
  GetSurveyByIdQueryResult,
  GetSurveyByIdQueryVariables,
} from '~/schema/generated';
import { client } from '~/lib/graphql';
import { hashids } from '~/utils/hash-ids';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  let surveyData: null | GetSurveyByIdQueryResult['data'] = null;
  if (ctx.params?.id && typeof ctx.params.id === 'string') {
    try {
      const res = await client.query<
        GetSurveyByIdQueryResult['data'],
        GetSurveyByIdQueryVariables
      >({
        query: GetSurveyByIdDocument,
        variables: {
          id: Number(hashids.decode(ctx.params.id)[0]),
        },
      });
      if (res.data?.surveys_by_pk) {
        surveyData = res.data;
      } else {
        return {
          notFound: true,
        };
      }
    } catch (err) {
      console.error(err);
    }
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
          content='/images/og-image.png'
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
        <BacktalkNewResponseContextProvider
          id={surveyData?.surveys_by_pk?.id ?? null}>
          <SurveyWrapper>
            <SurveyResponse />
          </SurveyWrapper>
        </BacktalkNewResponseContextProvider>
      </LayoutSurvey>
    </>
  );
};

export default SurveyPage;
