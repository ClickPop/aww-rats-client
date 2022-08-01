import {
  GetSurveyByIdQuery,
  Questions_Insert_Input,
  Question_Type_Enum,
  ResponseInput,
  Supported_Chains_Enum,
  Surveys_Insert_Input,
} from '~/schema/generated';

export type ResponseState = Required<
  Pick<ResponseInput['responses'][0], 'response_content' | 'question_id'>
> &
  Pick<ResponseInput['responses'][0], 'response_option_id'>;

export interface SurveyResponseState
  extends Exclude<GetSurveyByIdQuery['surveys_by_pk'], null | undefined> {
  step: number;
  responses: ResponseState[];
  currentResponse: ResponseState;
}

export type SurveyResponseAction =
  | { type: 'setState'; payload: SurveyResponseState }
  | { type: 'nextStep' }
  | { type: 'previousStep' }
  | { type: 'updateCurrentResponseFreeForm'; payload: string }
  | {
      type: 'updateCurrentResponseMultipleChoice';
      payload: { id: number; content: string };
    }
  | { type: 'startSurvey' }
  | { type: 'endSurvey' };

export type SurveyFormState = Required<
  Pick<Surveys_Insert_Input, 'title' | 'questions' | 'owner'>
> &
  Omit<Surveys_Insert_Input, 'title' | 'questions' | 'owner'>;
export type SurveyFormAction =
  | { type: 'setState'; payload: SurveyFormState }
  | { type: 'editTitle'; payload: string }
  | { type: 'editActive'; payload: boolean }
  | { type: 'addImage'; payload: number }
  | { type: 'deleteImage' }
  | { type: 'addQuestion'; payload: Questions_Insert_Input }
  | { type: 'deleteQuestion'; payload: number }
  | {
      type: 'editQuestionPrompt';
      payload: { prompt: string; index: number };
    }
  | {
      type: 'editQuestionRequired';
      payload: { required: boolean; index: number };
    }
  | {
      type: 'editQuestionType';
      payload: { questionType: Question_Type_Enum; index: number };
    }
  | { type: 'addContract' }
  | { type: 'deleteContract'; payload: number }
  | { type: 'deleteContracts' }
  | { type: 'editContractAddress'; payload: { address: string; index: number } }
  | { type: 'updateMaxResponses'; payload: number | null }
  | { type: 'editDescription'; payload: string }
  | {
      type: 'editChain';
      payload: { chain: Supported_Chains_Enum; index: number };
    }
  | { type: 'addQuestionOption'; payload: { index: number } }
  | {
      type: 'deleteQuestionOption';
      payload: { question_index: number; option_index: number };
    }
  | {
      type: 'editQuestionOption';
      payload: {
        question_index: number;
        option_index: number;
        content: string;
      };
    };

export interface SurveyFormData extends SurveyFormState {
  signerAddr: string | undefined;
  contractAddress: {
    index: number;
    address: string;
  } | null;
  prompt: {
    index: number;
    prompt: string;
  } | null;
  option: {
    index: number;
    question_index: number;
    content: string;
  } | null;
}
