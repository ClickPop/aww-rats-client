import {
  Question_Type_Enum,
  Supported_Chains_Enum,
  Token_Types_Enum,
} from '~/schema/generated';
import { SurveyFormAction, SurveyFormState } from '~/types';

export const defaultSurveyFormState: SurveyFormState = {
  title: '',
  questions: {
    data: [],
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
    case 'editDescription':
      return { ...state, description: action.payload };
    case 'editChain':
      return {
        ...state,
        contracts: state?.contracts
          ? {
              data: state.contracts.data.map((c, i) =>
                i === action.payload.index
                  ? { ...c, chain: action.payload.chain }
                  : c,
              ),
            }
          : undefined,
      };
    case 'addContract': {
      return {
        ...state,
        contracts: {
          data: [
            ...(state.contracts?.data ?? []),
            {
              address: '',
              token_type: Token_Types_Enum.Erc721,
              chain: Supported_Chains_Enum.Ethereum,
            },
          ],
        },
      };
    }
    case 'deleteContract': {
      return {
        ...state,
        contracts: {
          data: (state.contracts?.data ?? []).filter(
            (_, i) => i !== action.payload,
          ),
        },
      };
    }
    case 'deleteContracts': {
      return {
        ...state,
        contracts: undefined,
      };
    }
    case 'editContractAddress': {
      return {
        ...state,
        contracts: state?.contracts
          ? {
              ...state.contracts,
              data: state.contracts.data.map((c, i) =>
                i === action.payload.index
                  ? { ...c, address: action.payload.address }
                  : c,
              ),
            }
          : undefined,
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
    case 'editQuestionPrompt':
      return {
        ...state,
        questions: {
          ...state.questions,
          data:
            state.questions?.data?.map((q, i) =>
              i === action.payload.index
                ? { ...q, prompt: action.payload.prompt }
                : q,
            ) ?? [],
        },
      };
    case 'editQuestionRequired':
      return {
        ...state,
        questions: {
          ...state.questions,
          data:
            state.questions?.data?.map((q, i) =>
              i === action.payload.index
                ? { ...q, is_required: action.payload.required }
                : q,
            ) ?? [],
        },
      };
    case 'editQuestionType':
      return {
        ...state,
        questions: {
          ...state.questions,
          data:
            state.questions?.data?.map((q, i) =>
              i === action.payload.index
                ? {
                    ...q,
                    question_type: action.payload.questionType,
                    options:
                      action.payload.questionType ===
                      Question_Type_Enum.MultipleChoice
                        ? {
                            data: [{}, {}],
                          }
                        : undefined,
                  }
                : q,
            ) ?? [],
        },
      };
    case 'addQuestionOption':
      return {
        ...state,
        questions: {
          ...state.questions,
          data:
            state.questions?.data?.map((q, i) =>
              i === action.payload.index
                ? {
                    ...q,
                    options: {
                      ...(q.options ?? {}),
                      data: [...(q.options?.data ?? []), {}],
                    },
                  }
                : q,
            ) ?? [],
        },
      };
    case 'deleteQuestionOption':
      return {
        ...state,
        questions: {
          ...state.questions,
          data:
            state.questions?.data?.map((q, i) =>
              i === action.payload.question_index
                ? {
                    ...q,
                    options: {
                      ...(q.options ?? {}),
                      data:
                        q.options?.data.filter(
                          (_, idx) => idx !== action.payload.option_index,
                        ) ?? [],
                    },
                  }
                : q,
            ) ?? [],
        },
      };
    case 'editQuestionOption':
      return {
        ...state,
        questions: {
          ...state.questions,
          data:
            state.questions?.data?.map((q, i) =>
              i === action.payload.question_index
                ? {
                    ...q,
                    options: {
                      ...(q.options ?? {}),
                      data:
                        q.options?.data.map((o, idx) =>
                          idx === action.payload.option_index
                            ? { ...o, content: action.payload.content }
                            : o,
                        ) ?? [],
                    },
                  }
                : q,
            ) ?? [],
        },
      };
    case 'addImage':
      return {
        ...state,
        image_id: action.payload,
      };
    case 'deleteImage':
      return {
        ...state,
        image_id: undefined,
      };
    default:
      return state;
  }
};
