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
import {
  useGetPublicSurveysByWalletQuery,
  useGetSurveysByWalletQuery,
} from '~/schema/generated';

const WalletPage: NextPage = () => {
  const {
    query: { wallet },
  } = useRouter();

  const { data, loading, error } = useGetPublicSurveysByWalletQuery({
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
      <Center
        mt={4}
        p={3}
        bgColor='white'
        border='1px solid'
        borderColor='gray.200'
        borderRadius={12}>
        <Table>
          <Thead>
            <Tr>
              <Th>Name</Th>
              {data?.surveys?.some((s) => s.latest_response) && (
                <Th>Latest Response</Th>
              )}
              <Th isNumeric>Responses</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data?.surveys.map((survey, i) => (
              <Tr key={survey.id}>
                <Td
                  border={i === data?.surveys.length - 1 ? 'none' : undefined}
                  _hover={{ textDecoration: 'underline' }}>
                  <Link as={NextLink} href={`/results/${survey.id}`}>
                    {survey.title}
                  </Link>
                </Td>
                <Td
                  border={i === data?.surveys.length - 1 ? 'none' : undefined}>
                  {survey?.latest_response
                    ? format(
                        new Date(survey.latest_response),
                        "eeee, MMMM d, yyyy 'at' H:mm  (z)",
                      )
                    : 'None'}
                </Td>
                <Td
                  border={i === data?.surveys.length - 1 ? 'none' : undefined}
                  isNumeric>
                  {survey.response_count}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Center>
    </LayoutDashboard>
  );
};

export default WalletPage;
