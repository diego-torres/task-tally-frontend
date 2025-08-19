import * as React from 'react';
import { PageSection, Spinner } from '@patternfly/react-core';
import { useNavigate, useParams } from '@lib/router';
import TemplateForm from './TemplateForm';
import { useTemplateService } from '@api/templates/service';
import { UpdateTemplateRequest } from '@api/templates/types';
import { useAuth } from '@app/utils/AuthContext';

const TemplateEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getTemplate, updateTemplate } = useTemplateService();
  const { user } = useAuth();
  const username = user?.preferred_username;
  const [initial, setInitial] = React.useState<UpdateTemplateRequest | null>(null);


  React.useEffect(() => {
    const loadTemplate = async () => {
      if (!username || !id) return;
      try {
        const tpl = await getTemplate(username, parseInt(id, 10));
        setInitial(tpl);
      } catch (err) {
        console.error('Failed to load template:', err);
      }
    };

    void loadTemplate();
  }, [getTemplate, id, username]);

  const handleSubmit = async (value: UpdateTemplateRequest) => {
    if (!username || !id) return;
    await updateTemplate(username, parseInt(id, 10), value);
    navigate('/templates');
  };

  if (!initial) {
    return (
      <PageSection>
        <Spinner />
      </PageSection>
    );
  }

  return (
    <TemplateForm mode="edit" initial={initial} onSubmit={handleSubmit} onCancel={() => navigate(`/templates/${id}`)} />
  );
};

export default TemplateEditPage;
