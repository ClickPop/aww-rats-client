import {
  Contracts_Constraint,
  Contracts_Update_Column,
  Questions_Constraint,
  Questions_Update_Column,
  Token_Types_Enum,
} from '~/schema/generated';
import { SurveyFormAction, SurveyFormState } from '~/types';

export const defaultSurveyFormState: SurveyFormState = {
  title: '',
  questions: {
    data: [],
    on_conflict: {
      constraint: Questions_Constraint.QuestionsPkey,
      update_columns: [
        Questions_Update_Column.Prompt,
        Questions_Update_Column.IsRequired,
      ],
    },
  },
  owner: '',
};

export const surveyFormReducer = (
  state: SurveyFormState,
  action: SurveyFormAction,
): SurveyFormState => {
  switch (action.type) {
    case 'setState':
      return action.payload;
    case 'editTitle':
      return { ...state, title: action.payload };
    case 'editActive':
      return { ...state, is_active: action.payload };
    case 'updateMaxResponses':
      return { ...state, max_responses: action.payload };
    case 'addContract': {
      return {
        ...state,
        contract_address: undefined,
        contract: action.payload.address
          ? {
              data: {
                address: action.payload.address,
                token_type: Token_Types_Enum.Erc721,
              },
              on_conflict: {
                constraint: Contracts_Constraint.ContractsPkey,
                update_columns: [Contracts_Update_Column.Address],
              },
            }
          : undefined,
      };
    }
    case 'addContractAddress': {
      return {
        ...state,
        contract_address: action.payload,
        contract: undefined,
      };
    }
    case 'deleteQuestion':
      return {
        ...state,
        questions: {
          ...state.questions,
          data:
            state.questions?.data?.filter((_, i) => i !== action.payload) ?? [],
        },
      };
    case 'addQuestion':
      return {
        ...state,
        questions: {
          ...state.questions,
          data: [...(state.questions?.data ?? []), action.payload],
        },
      };
    case 'editQuestion':
      return {
        ...state,
        questions: {
          ...state.questions,
          data:
            state.questions?.data?.map((q, i) =>
              i === action.payload.index ? action.payload.question : q,
            ) ?? [],
        },
      };
    default:
      return state;
  }
};
