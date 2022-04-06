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
}) => {
  const { signerAddr } = useContext(EthersContext);
  const {
    data: surveyData,
    error: getSurveyError,
    loading: getSurveyLoading,
  } = useGetSurveyByIdQuery({
    variables: {
      id: id!,
    },
    skip: !id,
    client: apolloBacktalkClient,
  });

  const [surveyState, surveyResponseDispatch] = useReducer(
    surveyResponseReducer,
    defaultSurveyResponseState,
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
