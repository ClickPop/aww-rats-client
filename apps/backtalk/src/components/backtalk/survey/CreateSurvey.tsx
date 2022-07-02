import { useRouter } from 'next/router';
import React from 'react';
import { useCreateSurveyMutation } from '~/schema/generated';
import { CallBackArgs, SurveyForm } from './SurveyForm';
import { hashids } from '~/utils/hash-ids';

function CreateSurveyForm() {
  const [createSurvey, { loading }] = useCreateSurveyMutation();
  const { push } = useRouter();
  const onSubmit = async (data: CallBackArgs) => {
    const { signerAddr, contractAddress, prompt, option, ...surveyData } = data;
    if (signerAddr) {
      const res = await createSurvey({
        variables: {
          surveyInput: {
            ...surveyData,
            is_active: true,
            owner: signerAddr,
            contracts: surveyData.contracts
              ? {
                  ...surveyData.contracts,
                  data: surveyData.contracts.data.map((c, i) =>
                    contractAddress?.index === i
                      ? { ...c, address: contractAddress.address }
                      : c,
                  ),
                }
              : undefined,
            questions: surveyData.questions
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
              : undefined,
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
