import * as React from 'react';
import { PageSection } from '@patternfly/react-core';
import { useNavigate } from '@lib/router';
import TemplateForm from './TemplateForm';
import { createTemplate } from '@api/templates/service';
import { CreateTemplateRequest } from '@api/templates/types';

const TemplateCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const onSubmit = async (value: CreateTemplateRequest) => {
    await createTemplate(value);
    navigate('/templates');
  };
  return (
    <PageSection>
      <TemplateForm onSubmit={onSubmit} submitLabel="Create" />
    </PageSection>
  );
};

export default TemplateCreatePage;
