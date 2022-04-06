import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Box,
} from '@chakra-ui/react';
import React, { FC, useContext } from 'react';
import { BacktalkSurveyResultContext } from '~/components/context/BacktalkSurveyResults';

export const SurveyResultsList: FC = () => {
  const {
    surveyResult: { data },
    processedResponses,
    responseCount,
  } = useContext(BacktalkSurveyResultContext);

  return responseCount > 0 ? (
    <TableContainer
      backgroundColor='white'
      border='1px'
      borderColor='gray.200'
      borderRadius={8}>
      <Table variant='simple'>
        <Thead>
          <Tr textTransform='uppercase'>
            <Th>Wallet Address</Th>
            {!!data?.surveys_by_pk?.contract && <Th>Tokens</Th>}
            {data?.surveys_by_pk?.questions.map((q) => (
              <Th key={q.id}>{q.prompt}</Th>
            ))}
            <Th>Date</Th>
          </Tr>
        </Thead>
        <Tbody>
          {Object.entries(processedResponses).map(
            ([wallet, proccessedReponses]) => (
              <Tr key={wallet}>
                <Td>{wallet}</Td>
                {!!data?.surveys_by_pk?.contract && <Td>PLACEHOLDER</Td>}
                {proccessedReponses.responses.map((response) => (
                  <Td key={wallet + response}>{response}</Td>
                ))}
                <Td isNumeric>{proccessedReponses.date}</Td>
              </Tr>
            ),
          )}
        </Tbody>
      </Table>
    </TableContainer>
  ) : (
    <Box>No Responses</Box>
  );
};
