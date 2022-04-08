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
import { useRouter } from 'next/router';
import { SurveyResults } from '~/components/backtalk/results/SurveyResults';
import { BacktalkSurveyResultContextProvider } from '~/components/context/BacktalkSurveyResults';

const ResultsPage: NextPage = () => {
  const { query } = useRouter();
  const surveyId = typeof query.id === 'string' ? parseInt(query.id, 10) : null;
  return (
    <LayoutDashboard>
      <BacktalkSurveyResultContextProvider id={surveyId}>
        <SurveyResults />
      </BacktalkSurveyResultContextProvider>
    </LayoutDashboard>
  );
};

export default ResultsPage;
