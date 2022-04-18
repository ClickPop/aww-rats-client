import {
  createContext,
  Dispatch,
  FC,
  useContext,
  useEffect,
  useReducer,
} from 'react';
import { EthersContext } from '~/components/context/EthersContext';
import { apolloBacktalkClient } from '~/lib/graphql';
import {
  defaultSurveyResponseState,
  surveyResponseReducer,
} from '~/reducers/surveyResponse';
import {
  GetSurveyByIdQueryResult,
  useGetSurveyByIdQuery,
} from '~/schema/generated';
import { SurveyResponseAction, SurveyResponseState } from '~/types';

type Props = {
  id: number | null;
  survey?: null | GetSurveyByIdQueryResult['data'];
};

type DefaultContext = {
  surveyFetchState: Pick<GetSurveyByIdQueryResult, 'error' | 'loading'>;
  surveyResponseData: SurveyResponseState;
  surveyResponseDispatch: Dispatch<SurveyResponseAction>;
};

const defaultContext: DefaultContext = {
  surveyFetchState: { loading: false },
  surveyResponseData: defaultSurveyResponseState,
  surveyResponseDispatch: () => {},
};

export const backtalkNewResponseContext = createContext(defaultContext);

export const BacktalkNewResponseContextProvider: FC<Props> = ({
  children,
  id,
  survey,
}) => {
  const { signerAddr } = useContext(EthersContext);
  const {
    data: surveyData,
    error: getSurveyError,
    loading: getSurveyLoading,
  } = useGetSurveyByIdQuery({
    variables: {
      id: id!,
      includeMyResponses: true,
      wallet: signerAddr,
    },
    skip: !id,
    client: apolloBacktalkClient,
  });

  const [surveyState, surveyResponseDispatch] = useReducer(
    surveyResponseReducer,
    {
      ...defaultSurveyResponseState,
      ...{
        ...(survey?.surveys_by_pk ?? {}),
        step:
          (survey?.surveys_by_pk?.callerResponses?.length ?? 0) > 1
            ? (survey?.surveys_by_pk?.questions?.length ?? 0) + 1
            : -1,
      },
    },
  );

  useEffect(() => {
    if (
      !getSurveyLoading &&
      !getSurveyError &&
      surveyData?.surveys_by_pk &&
      surveyState.id === -1
    ) {
      surveyResponseDispatch({
        type: 'setState',
        payload: {
          ...surveyData.surveys_by_pk,
          step: -1,
          responses: [],
          currentResponse: {
            question_id: surveyData.surveys_by_pk.questions?.[0].id,
            response_content: '',
          },
        },
      });
    }
  }, [
    getSurveyError,
    getSurveyLoading,
    surveyData?.surveys_by_pk,
    surveyState.id,
    signerAddr,
  ]);

  return (
    <backtalkNewResponseContext.Provider
      value={{
        surveyFetchState: {
          error: getSurveyError,
          loading: getSurveyLoading,
        },
        surveyResponseData: surveyState,
        surveyResponseDispatch,
      }}>
      {children}
    </backtalkNewResponseContext.Provider>
  );
};
