import { Center } from '@chakra-ui/react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { LayoutDashboard } from '~/components/backtalk/LayoutDashboard';
import { useGetSurveysByWalletQuery } from '~/schema/generated';
import { SurveyList } from '~/components/backtalk/SurveyList';

const WalletPage: NextPage = () => {
  const {
    query: { wallet },
  } = useRouter();

  const { data, loading, error } = useGetSurveysByWalletQuery({
    variables: {
      wallet: wallet as string,
    },
  });

  if (loading) {
    return <Center>Loading...</Center>;
  }

  if (error) {
    console.error(error);
    return <Center>An error occurred</Center>;
  }

  return (
    <LayoutDashboard>
      <Center>
        <SurveyList surveys={data?.surveys ?? []} />
      </Center>
    </LayoutDashboard>
  );
};

export default WalletPage;
