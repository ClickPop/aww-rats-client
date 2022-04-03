import {
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  Progress,
  Select,
  Spacer,
  Text,
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

const ResultsPage: NextPage = () => {
  return (
    <LayoutDashboard>
        <Flex align='baseline' my={4}>
            <Heading size='md'>Marbles on Stream POAP</Heading>
            <Spacer />
            <Select background='white' maxW='10rem' size='sm'>    
                <option>Active</option>
                <option>Inactive</option>
            </Select>
            <Select background='white' maxW='10rem' ml={2} size='sm'>
                <option>Public</option>
                <option>Private</option>
            </Select>
            <Button colorScheme='teal' ml={2} size='sm'>
                Export
            </Button>
        </Flex>

        <Grid gap={4} templateColumns='repeat(2, 1fr)'>
            <GridItem
                backgroundColor='white'
                border='1px'
                borderColor='gray.200'
                borderRadius={8}
                mb={4}
                p={4}
            >
                <Heading as='h2' color='gray.500' size='sm'>Responses</Heading>
                <Text fontSize='xl'>9/10</Text>
                <Progress value={9} max={10} />
            </GridItem>

            <GridItem
                backgroundColor='white'
                border='1px'
                borderColor='gray.200'
                borderRadius={8}
                mb={4}
                p={4}
            >
                <Heading as='h2' color='gray.500' size='sm'>Last Response</Heading>
                <Text fontSize='xl'>03/01/2022</Text>
            </GridItem>
        </Grid>

        <TableContainer
        backgroundColor='white'
        border='1px'
        borderColor='gray.200'
        borderRadius={8}>
            <Table variant='simple'>
                <Thead>
                    <Tr textTransform='uppercase'>
                        <Th>Wallet Address</Th>
                        <Th>Tokens</Th>
                        <Th>Date</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    <Tr>
                        <Td>0x89d0ad961584bc9c65d2982ad82faf0371939bdc</Td>
                        <Td>2</Td>
                        <Td isNumeric>01/03/2022 @ 9:55am</Td>
                    </Tr>
                </Tbody>
            </Table>
        </TableContainer>
    </LayoutDashboard>
  );
};

export default ResultsPage;
