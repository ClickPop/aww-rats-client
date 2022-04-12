import { NetworkStatus } from '@apollo/client';
import { compareAsc } from 'date-fns';
import { createContext, FC, useMemo } from 'react';
import { apolloBacktalkClient } from '~/lib/graphql';
import {
  GetSurveyByIdQueryResult,
  useGetSurveyByIdQuery,
} from '~/schema/generated';

type Props = {
  id: number | null;
};

type DefaultValue = {
  surveyResult: Pick<
    GetSurveyByIdQueryResult,
    'data' | 'error' | 'loading' | 'refetch'
  >;
};

const defaultValue: DefaultValue = {
  surveyResult: {
    data: {},
    loading: false,
    refetch: async () => ({
      data: {},
      loading: false,
      networkStatus: NetworkStatus.ready,
    }),
  },
};

export const BacktalkSurveyResultContext = createContext(defaultValue);

export const BacktalkSurveyResultContextProvider: FC<Props> = ({
  id,
  children,
}) => {
  const surveyResult = useGetSurveyByIdQuery({
    variables: { id: id!, includeResponses: true },
    skip: id === null,
    client: apolloBacktalkClient,
  });

  return (
    <BacktalkSurveyResultContext.Provider
      value={{
        surveyResult,
      }}>
      {children}
    </BacktalkSurveyResultContext.Provider>
  );
};
