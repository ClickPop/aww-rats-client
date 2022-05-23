import {
  Center,
  Link,
  Table,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { format } from 'date-fns';
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

  console.log(data);

  return (
    <LayoutDashboard>
      <Center>
        <SurveyList surveys={data?.surveys ?? []} />
      </Center>
    </LayoutDashboard>
  );
};

export default WalletPage;
