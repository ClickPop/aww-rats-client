import { GetSurveyByIdQuery, ResponseInput } from '~/schema/generated';

export type ResponseState = Required<
  Pick<ResponseInput, 'response_content' | 'question_id'>
> &
  Pick<ResponseInput, 'response_option_id'>;

export interface SurveyFormState
  extends Exclude<GetSurveyByIdQuery['surveys_by_pk'], null | undefined> {
  step: number;
  responses: ResponseState[];
  currentResponse: ResponseState;
}

export type SurveyFormAction =
  | { type: 'setState'; payload: SurveyFormState }
  | { type: 'nextStep' }
  | { type: 'previousStep' }
  | { type: 'updateCurrentResponseFreeForm'; payload: string }
  | { type: 'startSurvey' };
