import { useRouter } from 'next/router';
import React from 'react';
import { useCreateSurveyMutation } from '~/schema/generated';
import SurveyForm from './SurveyForm';
import { hashids } from '~/utils/hash-ids';
import { SurveyFormData } from '~/types';

function CreateSurveyForm() {
  const [createSurvey, { loading }] = useCreateSurveyMutation();
  const { push } = useRouter();
  const onSubmit = async (data: SurveyFormData) => {
    const { signerAddr, contractAddress, prompt, option, ...surveyData } = data;
    const contracts = surveyData.contracts
      ? {
          ...surveyData.contracts,
          data: surveyData.contracts.data.map((c, i) =>
            contractAddress?.index === i
              ? { ...c, address: contractAddress.address }
              : c,
          ),
        }
      : undefined;
    const questions = surveyData.questions
      ? {
          ...surveyData.questions,
          data: surveyData.questions.data.map((q, i) => ({
            ...q,
            prompt:
              prompt && prompt.index === i && prompt.prompt
                ? prompt.prompt
                : q.prompt,
            options: q.options
              ? {
                  ...q.options,
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
      const res = await createSurvey({
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
      if (res.data?.insert_surveys_one) {
        push(`/results/${hashids.encode(res.data.insert_surveys_one.id)}`);
      }
    }
  };

  return <SurveyForm onSubmit={onSubmit} isLoading={loading} />;
}

export default CreateSurveyForm;
