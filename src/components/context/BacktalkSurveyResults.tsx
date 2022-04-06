import { compareAsc } from 'date-fns';
import { createContext, FC, useMemo } from 'react';
import { apolloBacktalkClient } from '~/lib/graphql';
import {
  GetSurveyByIdQuery,
  GetSurveyByIdQueryResult,
  useGetSurveyByIdQuery,
} from '~/schema/generated';

type Props = {
  id: number | null;
};

type DefaultValue = {
  surveyResult: Pick<GetSurveyByIdQueryResult, 'data' | 'error' | 'loading'>;
  responseCount: number;
  latestResponse: Date;
  processedResponses: Record<
    string,
    {
      responses: string[];
      date: string;
    }
  >;
};

const defaultValue: DefaultValue = {
  surveyResult: { data: {}, loading: false },
  responseCount: 0,
  latestResponse: new Date(0),
  processedResponses: {},
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

  const responseCount = Math.max(
    ...(surveyResult?.data?.surveys_by_pk?.questions.map(
      (q) => q.responses_aggregate?.aggregate?.count ?? 0,
    ) ?? [0]),
  );

  const latestResponse =
    surveyResult?.data?.surveys_by_pk?.questions?.reduce<Date>((acc, curr) => {
      const currDate = new Date(curr.latest_response[0].created_at ?? 0);
      return compareAsc(currDate, acc) < 1 ? acc : currDate;
    }, new Date(0)) ?? new Date(0);

  const wallets = Array.from(
    surveyResult?.data?.surveys_by_pk?.questions.reduce((acc, curr) => {
      curr.responses?.forEach((r) => acc.add(r.wallet));
      return acc;
    }, new Set<string>()) ?? new Set<string>(),
  );

  const processedResponses = wallets.reduce<
    Record<string, { responses: string[]; date: string }>
  >(
    (acc, curr) => ({
      ...acc,
      [curr]: {
        responses:
          surveyResult?.data?.surveys_by_pk?.questions.map(
            (q) =>
              q.responses?.find((r) => r.wallet === curr)?.response_content ??
              '',
          ) ?? [],
        date: new Date(
          surveyResult?.data?.surveys_by_pk?.questions.reduce(
            (a, c) =>
              c.responses?.find((r) => r.wallet === curr)?.created_at ?? a,
            '',
          ) ?? 0,
        ).toISOString(),
      },
    }),
    {},
  );

  return (
    <BacktalkSurveyResultContext.Provider
      value={{
        surveyResult,
        responseCount,
        latestResponse,
        processedResponses,
      }}>
      {children}
    </BacktalkSurveyResultContext.Provider>
  );
};
