import { useBoolean } from '@chakra-ui/react';
import { createContext, Dispatch, FC, useEffect, useReducer } from 'react';
import {
  defaultSurveyFormState,
  surveyFormReducer,
} from '~/reducers/surveyForm';
import {
  Contracts_Constraint,
  Contracts_Update_Column,
  Options_Constraint,
  Options_Update_Column,
  Questions_Constraint,
  Questions_Update_Column,
  Surveys_Insert_Input,
  UpsertSurveyMutationResult,
  useGetSurveyByIdQuery,
  useUpsertSurveyMutation,
} from '~/schema/generated';
import { SurveyFormAction, SurveyFormData, SurveyFormState } from '~/types';
import { useSignerAddress } from 'common/hooks/useSignerAddress';
import { useRouter } from 'next/router';
import { hashids } from '~/utils/hash-ids';

type Props = {
  id: number | null;
};

type DefaultContext = {
  surveyData: SurveyFormState;
  surveyDataDispatch: Dispatch<SurveyFormAction>;
  onSubmit: (data: SurveyFormData) => Promise<void>;
  upsertStatus: Pick<UpsertSurveyMutationResult, 'data' | 'error' | 'loading'>;
};

const defaultContext: DefaultContext = {
  surveyData: defaultSurveyFormState,
  surveyDataDispatch: () => {},
  onSubmit: async () => {},
  upsertStatus: { loading: false },
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

  const [upsertSurvey, upsertStatus] = useUpsertSurveyMutation();
  const { push } = useRouter();
  const onSubmit = async (data: SurveyFormData) => {
    const { signerAddr, contractAddress, prompt, option, ...surveyData } = data;
    const contracts: Surveys_Insert_Input['contracts'] = surveyData.contracts
      ? {
          ...surveyData.contracts,
          on_conflict: {
            constraint: Contracts_Constraint.ContractsPkey,
            update_columns: [
              Contracts_Update_Column.Address,
              Contracts_Update_Column.Chain,
              Contracts_Update_Column.TokenType,
              Contracts_Update_Column.TokenIds,
            ],
          },
          data: surveyData.contracts.data.map((c, i) =>
            contractAddress?.index === i
              ? { ...c, address: contractAddress.address }
              : c,
          ),
        }
      : undefined;
    const questions: Surveys_Insert_Input['questions'] = surveyData.questions
      ? {
          ...surveyData.questions,
          on_conflict: {
            constraint: Questions_Constraint.QuestionsPkey,
            update_columns: [
              Questions_Update_Column.Prompt,
              Questions_Update_Column.IsRequired,
              Questions_Update_Column.QuestionType,
            ],
          },
          data: surveyData.questions.data.map((q, i) => ({
            ...q,
            prompt:
              prompt && prompt.index === i && prompt.prompt
                ? prompt.prompt
                : q.prompt,
            options: q.options
              ? {
                  ...q.options,
                  on_conflict: {
                    constraint: Options_Constraint.OptionsPkey,
                    update_columns: [Options_Update_Column.Content],
                  },
                  data: q.options.data.map((o, idx) => ({
                    ...o,
                    content:
                      option &&
                      option.question_index === i &&
                      option.index === idx &&
                      option.content
                        ? option.content
                        : o.content,
                  })),
                }
              : undefined,
          })),
        }
      : undefined;
    if (signerAddr) {
      const res = await upsertSurvey({
        variables: {
          surveyInput: {
            ...surveyData,
            contracts,
            questions,
            is_active: true,
            owner: signerAddr,
          },
        },
      });

      await surveyResult.refetch();

      if (res.data?.insert_surveys_one) {
        push(`/results/${hashids.encode(res.data.insert_surveys_one.id)}`);
      }
    }
  };

  return (
    <BacktalkSurveyFormContext.Provider
      value={{
        surveyData,
        surveyDataDispatch,
        onSubmit,
        upsertStatus,
      }}>
      {children}
    </BacktalkSurveyFormContext.Provider>
  );
};
