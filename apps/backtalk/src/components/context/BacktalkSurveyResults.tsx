import { NetworkStatus } from '@apollo/client';
import { createContext, FC } from 'react';
import {
  GetSurveyByIdQuery,
  GetSurveyByIdQueryResult,
  Survey_Responses,
  useGetSurveyByIdQuery,
} from '~/schema/generated';

type Props = {
  id: number | null;
};

type DefaultValue = {
  surveyResult: Pick<
    GetSurveyByIdQueryResult,
    'error' | 'loading' | 'refetch'
  > & {
    data?: {
      surveys_by_pk?:
        | (Omit<
            Exclude<GetSurveyByIdQuery['surveys_by_pk'], null | undefined>,
            'survey_responses'
          > & {
            survey_responses?: (Omit<Survey_Responses, 'question_responses'> & {
              question_responses?: Record<
                string,
                {
                  response: string;
                  option_id: number | null;
                  option: string | null;
                }
              >;
            })[];
          })
        | null;
    };
  };
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
