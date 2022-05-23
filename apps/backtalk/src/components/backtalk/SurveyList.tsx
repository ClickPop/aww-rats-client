import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Text,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { hashids } from 'src/utils/hash-ids';
import React, { FC, useMemo } from 'react';
import { Link } from 'common/components/shared/Link';
import { GetSurveysByWalletQuery } from '~/schema/generated';

type Props = {
  surveys: GetSurveysByWalletQuery['surveys'];
  showActions?: boolean;
};

export const SurveyList: FC<Props> = ({ surveys, showActions }) => {
  const latestResponseBySurveyId = useMemo(
    () =>
      surveys.reduce<Record<number, Date | undefined>>(
        (acc, curr) => ({
          ...acc,
          [curr.id]: curr.latest_response
            ? new Date(curr.latest_response)
            : undefined,
        }),
        {},
      ),
    [surveys],
  );

  const responseCountBySurveyId = useMemo(
    () =>
      surveys.reduce<Record<number, number>>(
        (acc, curr) => ({
          ...acc,
          [curr.id]: curr.response_count ?? 0,
        }),
        {},
      ),
    [surveys],
  );

  return (
    <TableContainer
      backgroundColor='white'
      border='1px'
      borderColor='gray.200'
      borderRadius={8}>
      <Table variant='simple'>
        <Thead>
          <Tr textTransform='uppercase'>
            <Th>Name</Th>
            <Th>Last Response</Th>
            <Th>Status</Th>
            <Th isNumeric>Responses</Th>
            {showActions && <Th>Actions</Th>}
          </Tr>
        </Thead>
        <Tbody>
          {surveys.map((survey) => (
            <Tr key={survey.id}>
              <Td>
                <Link href={`/results/${hashids.encode(survey.id)}`}>
                  <Text isTruncated maxW={64}>
                    {survey.title}
                  </Text>
                </Link>
              </Td>
              <Td>
                {latestResponseBySurveyId?.[survey.id]
                  ? format(
                      latestResponseBySurveyId[survey.id] as Date,
                      "MM/dd/yy '-' H:mm",
                    )
                  : 'None'}
              </Td>
              <Td>{survey.is_active ? 'Active' : 'Inactive'}</Td>
              <Td isNumeric>{responseCountBySurveyId?.[survey.id] ?? 0}</Td>
              {showActions && (
                <Td>
                  <Link href={`/results/${hashids.encode(survey.id)}`}>📈</Link>{' '}
                  <Link
                    href={`/survey/${hashids.encode(survey.id)}`}
                    openInNewTab>
                    🔗
                  </Link>
                </Td>
              )}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
