import * as React from 'react';
import { useNavigate } from '@lib/router';
import TemplateForm from './TemplateForm';
import { createTemplate } from '@api/templates/service';
import { CreateTemplateRequest } from '@api/templates/types';

const TemplateCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const onSubmit = async (value: CreateTemplateRequest) => {
    await createTemplate('me', value);
    navigate('/templates');
  };
  return <TemplateForm mode="create" onSubmit={onSubmit} onCancel={() => navigate('/templates')} />;
};

export default TemplateCreatePage;
