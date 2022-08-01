import React from 'react';
import { useUpdateSurveyMutation } from '~/schema/generated';
import SurveyForm from './SurveyForm';
import { SurveyFormData } from '~/types';

function EditSurveyForm() {
  const [updateSurvey, { loading, error }] = useUpdateSurveyMutation();
  const handleSurveyUpdate = async () => {
    //TODO: add api call to update form
    // updateSurvey({variables:{ id:data.id, surveyInput:{title:data.title} }})
  };
  return <SurveyForm isLoading={loading} onSubmit={handleSurveyUpdate} />;
}

export default EditSurveyForm;
