import { useBoolean } from '@chakra-ui/react';
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
import { useGetSurveyByIdQuery } from '~/schema/generated';
import { SurveyFormAction, SurveyFormState } from '~/types';

type Props = {
  id: number | null;
};

type DefaultContext = {
  surveyData: SurveyFormState;
  surveyDataDispatch: Dispatch<SurveyFormAction>;
};

const defaultContext: DefaultContext = {
  surveyData: defaultSurveyFormState,
  surveyDataDispatch: () => {},
};

export const BacktalkSurveyFormContext = createContext(defaultContext);

export const BacktalkSurveyFormContextProvider: FC<Props> = ({
  children,
  id,
}) => {
  const [shouldUpdateReducer, { off }] = useBoolean(true);
  const { signerAddr } = useContext(EthersContext);
  const surveyResult = useGetSurveyByIdQuery({
    variables: { id: id! },
    skip: id === null,
    client: apolloBacktalkClient,
  });

  const [surveyData, surveyDataDispatch] = useReducer(
    surveyFormReducer,
    defaultSurveyFormState,
  );

  useEffect(() => {
    if (surveyResult.data?.surveys_by_pk && signerAddr && shouldUpdateReducer) {
      surveyDataDispatch({
        type: 'setState',
        payload: {
          ...surveyResult.data.surveys_by_pk,
          owner: signerAddr,
          questions: {
            data: surveyResult.data.surveys_by_pk.questions.map((q) => ({
              id: q.id,
              prompt: q.prompt,
              is_required: q.is_required,
            })),
          },
          contract: surveyResult.data.surveys_by_pk.contract
            ? {
                data: {
                  address: surveyResult.data.surveys_by_pk.contract.address,
                  token_type:
                    surveyResult.data.surveys_by_pk.contract.token_type,
                },
              }
            : undefined,
        },
      });
      off();
    }
  }, [off, shouldUpdateReducer, signerAddr, surveyResult.data?.surveys_by_pk]);

  return (
    <BacktalkSurveyFormContext.Provider
      value={{
        surveyData,
        surveyDataDispatch,
      }}>
      {children}
    </BacktalkSurveyFormContext.Provider>
  );
};
