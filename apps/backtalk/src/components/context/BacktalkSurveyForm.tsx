import { useBoolean } from '@chakra-ui/react';
import {
  createContext,
  Dispatch,
  FC,
  useContext,
  useEffect,
  useReducer,
} from 'react';
import { EthersContext } from 'common/components/context/EthersContext';
import {
  defaultSurveyFormState,
  surveyFormReducer,
} from '~/reducers/surveyForm';
import { useGetSurveyByIdQuery } from '~/schema/generated';
import { SurveyFormAction, SurveyFormState } from '~/types';
import { useSignerAddress } from 'common/hooks/useSignerAddress';

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
  const signerAddr = useSignerAddress();
  const surveyResult = useGetSurveyByIdQuery({
    variables: { id: id! },
    skip: id === null,
  });

  const [surveyData, surveyDataDispatch] = useReducer(
    surveyFormReducer,
    defaultSurveyFormState,
  );

  useEffect(() => {
    if (surveyResult.data?.surveys_by_pk && signerAddr && shouldUpdateReducer) {
      console.log('dd', surveyResult);

      surveyDataDispatch({
        type: 'setState',
        payload: {
          ...surveyResult.data.surveys_by_pk,
          title: surveyResult.data.surveys_by_pk.title,
          owner: signerAddr,
          questions: {
            data: surveyResult.data.surveys_by_pk.questions.map((q) => ({
              id: q.id,
              prompt: q.prompt,
              is_required: q.is_required,
              question_type: q.question_type,
              options: { data: q?.options || [] },
            })),
          },
          contracts: surveyResult?.data?.surveys_by_pk?.contracts
            ? {
                data: surveyResult?.data?.surveys_by_pk?.contracts,
              }
            : undefined,
          survey_responses: undefined,
          survey_image: surveyResult?.data?.surveys_by_pk?.survey_image
            ? {
                data: surveyResult?.data?.surveys_by_pk?.survey_image,
              }
            : undefined,
        },
      });
      off();
    }
  }, [off, shouldUpdateReducer, signerAddr, surveyResult]);

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
