import {
  Contracts_Insert_Input,
  GetSurveyByIdQuery,
  Questions_Insert_Input,
  ResponseInput,
  Surveys_Insert_Input,
} from '~/schema/generated';

export type ResponseState = Required<
  Pick<ResponseInput, 'response_content' | 'question_id'>
> &
  Pick<ResponseInput, 'response_option_id'>;

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
  | { type: 'addQuestion'; payload: Questions_Insert_Input }
  | { type: 'deleteQuestion'; payload: number }
  | {
      type: 'editQuestion';
      payload: { question: Questions_Insert_Input; index: number };
    }
  | { type: 'addContract'; payload: Contracts_Insert_Input }
  | { type: 'addContractAddress'; payload: string }
  | { type: 'updateMaxResponses'; payload: number | null };
