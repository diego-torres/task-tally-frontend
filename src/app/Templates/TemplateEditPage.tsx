import * as React from 'react';
import { PageSection, Spinner } from '@patternfly/react-core';
import { useNavigate, useParams } from '@lib/router';
import TemplateForm from './TemplateForm';
import { getTemplate, updateTemplate } from '@api/templates/service';
import { CreateTemplateRequest } from '@api/templates/types';

const TemplateEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [initial, setInitial] = React.useState<CreateTemplateRequest | null>(null);

  React.useEffect(() => {
    async function load() {
      if (id) {
        const tpl = await getTemplate('me', id);
        setInitial({ ...tpl });
      }
    }
    void load();
  }, [id]);

  const onSubmit = async (value: CreateTemplateRequest) => {
    if (id) {
      await updateTemplate('me', id, value);
      navigate(`/templates/${id}`);
    }
  };

  if (!initial) {
    return (
      <PageSection>
        <Spinner />
      </PageSection>
    );
  }

  return (
    <TemplateForm mode="edit" initial={initial} onSubmit={onSubmit} onCancel={() => navigate(`/templates/${id}`)} />
  );
};

export default TemplateEditPage;
