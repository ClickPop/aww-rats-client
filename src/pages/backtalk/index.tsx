import {
  Box,
  Button,
  Flex,
  Heading,
  Spacer,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from '@chakra-ui/react';
import { LayoutDashboard } from '~/components/backtalk/LayoutDashboard';
import { NextPage } from 'next';

const BacktalkPage: NextPage = () => {
  return (
    <LayoutDashboard>
      <Flex
        align='baseline'
        my={4}
      >
        <Heading
          size='md'
        >
          Surveys
        </Heading>
        <Spacer />
        <Button
          colorScheme='teal'
          size='sm'
          variant='link'
          >
            Public Surveys
        </Button>
        <Button
          colorScheme='teal'
          ml={2}
          size='sm'
          >
            + Survey
        </Button>
      </Flex>

      <TableContainer
        backgroundColor='white'
        border='1px'
        borderColor='gray.200'
        borderRadius={8}
      >
        <Table variant='simple'>
          <Thead>
            <Tr textTransform='uppercase'>
              <Th>Name</Th>
              <Th>Last Response</Th>
              <Th>Status</Th>
              <Th>Visibility</Th>
              <Th isNumeric>Responses</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>Community Ballot</Td>
              <Td>10 minutes ago</Td>
              <Td>Active</Td>
              <Td>Public</Td>
              <Td isNumeric>121</Td>
            </Tr>
            <Tr>
              <Td>Marbles on Stream POAP</Td>
              <Td>01/30/2022</Td>
              <Td>Active</Td>
              <Td>Public</Td>
              <Td isNumeric>9/10</Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    </LayoutDashboard>
  );
};

export default BacktalkPage;
