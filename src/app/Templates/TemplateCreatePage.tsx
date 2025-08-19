import * as React from 'react';
import { useNavigate } from '@lib/router';
import TemplateForm from './TemplateForm';
import { useTemplateService } from '@api/templates/service';
import { CreateTemplateRequest } from '@api/templates/types';
import { useAuth } from '@app/utils/AuthContext';

const TemplateCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { createTemplate } = useTemplateService();
  const { user } = useAuth();
  const username = user?.preferred_username;

  const handleSubmit = async (value: CreateTemplateRequest) => {
    if (!username) return;
    await createTemplate(username, value);
    navigate('/templates');
  };
  
  return (
    <>
      <h1>Create Template</h1>
      <TemplateForm mode="create" onSubmit={handleSubmit} onCancel={() => navigate('/templates')} />
    </>
  );
};

export default TemplateCreatePage;
