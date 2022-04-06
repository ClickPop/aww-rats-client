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
  defaultSurveyFormState,
  surveyFormReducer,
} from '~/reducers/surveyForm';
import {
  GetSurveyByIdQueryResult,
  useGetSurveyByIdQuery,
} from '~/schema/generated';
import { SurveyFormAction, SurveyFormState } from '~/types';

type Props = {
  id: number | null;
};

type DefaultContext = {
  surveyFetchState: Pick<GetSurveyByIdQueryResult, 'error' | 'loading'>;
  surveyFormData: SurveyFormState;
  surveyFormDispatch: Dispatch<SurveyFormAction>;
};

const defaultContext: DefaultContext = {
  surveyFetchState: { loading: false },
  surveyFormData: defaultSurveyFormState,
  surveyFormDispatch: () => {},
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

  const [surveyState, surveyFormDispatch] = useReducer(
    surveyFormReducer,
    defaultSurveyFormState,
  );

  useEffect(() => {
    if (
      !getSurveyLoading &&
      !getSurveyError &&
      surveyData?.surveys_by_pk &&
      surveyState.id === -1
    ) {
      surveyFormDispatch({
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
        surveyFormData: surveyState,
        surveyFormDispatch,
      }}>
      {children}
    </backtalkNewResponseContext.Provider>
  );
};
