import * as React from 'react';
import { PageSection, Spinner } from '@patternfly/react-core';
import { useNavigate, useParams } from '@lib/router';
import TemplateForm from './TemplateForm';
import { getTemplate, updateTemplate } from '@api/templates/service';
import { CreateTemplateRequest } from '@api/templates/types';

const TemplateEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [initial, setInitial] = React.useState<CreateTemplateRequest | null>(
    null,
  );

  React.useEffect(() => {
    async function load() {
      if (id) {
        const tpl = await getTemplate(id);
        setInitial({ ...tpl, files: tpl.files || { template: { name: tpl.name } } });
      }
    }
    void load();
  }, [id]);

  const onSubmit = async (value: CreateTemplateRequest) => {
    if (id) {
      await updateTemplate(id, value);
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
    <PageSection>
      <TemplateForm initial={initial} onSubmit={onSubmit} submitLabel="Save" />
    </PageSection>
  );
};

export default TemplateEditPage;
