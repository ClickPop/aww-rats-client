import { LayoutDashboard } from '~/components/backtalk/LayoutDashboard';
import { GetServerSideProps, NextPage } from 'next';
import { SurveyResults } from '~/components/backtalk/results/SurveyResults';
import { BacktalkSurveyResultContextProvider } from '~/components/context/BacktalkSurveyResults';
import { hashids } from '~/utils/hash-ids';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  let id: number | null = null;
  if (ctx.params?.id && typeof ctx.params.id === 'string') {
    id = Number(hashids.decode(ctx.params.id)[0]);
  }
  return {
    props: {
      id,
      host: ctx.req.headers.host,
    },
  };
};

type Props = {
  id: number | null;
  host?: string;
};

const ResultsPage: NextPage<Props> = ({ id, host }) => {
  return (
    <LayoutDashboard>
      <BacktalkSurveyResultContextProvider id={id}>
        <SurveyResults host={host} />
      </BacktalkSurveyResultContextProvider>
    </LayoutDashboard>
  );
};

export default ResultsPage;
