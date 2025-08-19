import * as React from 'react';
import { Alert, AlertActionCloseButton, PageSection } from '@patternfly/react-core';
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
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (value: CreateTemplateRequest) => {
    if (!username) return;
    try {
      setError(null);
      await createTemplate(username, value);
      navigate('/templates');
    } catch (err) {
      console.error('Failed to create template:', err);
      setError(err instanceof Error ? err.message : 'Failed to create template');
    }
  };
  
  return (
    <>
      {error && (
        <PageSection>
          <Alert
            variant="danger"
            title="Error creating template"
            actionClose={<AlertActionCloseButton onClose={() => setError(null)} />}
          >
            {error}
            <p>Check that the selected SSH key is valid and has been configured for this user, and the ssh git endpoint is set to the correct location.</p>
          </Alert>
        </PageSection>
      )}
      <h1>Create Template</h1>
      <TemplateForm mode="create" onSubmit={handleSubmit} onCancel={() => navigate('/templates')} />
    </>
  );
};

export default TemplateCreatePage;
