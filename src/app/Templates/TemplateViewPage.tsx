import * as React from 'react';
import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  PageSection,
  Spinner,
} from '@patternfly/react-core';
import { useNavigate, useParams } from '@lib/router';
import { useTemplateService } from '@api/templates/service';
import { TemplateDto } from '@api/templates/types';
import { Button } from '@patternfly/react-core';

const TemplateViewPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getTemplate } = useTemplateService();
  const [tpl, setTpl] = React.useState<TemplateDto | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function load() {
      if (id) {
        try {
          const res = await getTemplate('me', parseInt(id, 10));
          setTpl(res);
        } catch (err: unknown) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError('Unknown error');
          }
        }
      }
    }
    void load();
  }, [id, getTemplate]);

  if (error) {
    return (
      <PageSection>
        <div style={{ color: 'red', fontWeight: 'bold' }}>Error: {error}</div>
      </PageSection>
    );
  }
  if (!tpl) {
    return (
      <PageSection>
        <Spinner />
      </PageSection>
    );
  }

  return (
    <PageSection>
      <Button variant="link" onClick={() => navigate(`/templates/${tpl.id}/edit`)}>
        Edit
      </Button>
      <DescriptionList>
        <DescriptionListGroup>
          <DescriptionListTerm>Name</DescriptionListTerm>
          <DescriptionListDescription>{tpl.name}</DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Description</DescriptionListTerm>
          <DescriptionListDescription>{tpl.description || '-'}</DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Provider</DescriptionListTerm>
          <DescriptionListDescription>{tpl.provider}</DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Repository URL</DescriptionListTerm>
          <DescriptionListDescription>{tpl.repositoryUrl}</DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Default Branch</DescriptionListTerm>
          <DescriptionListDescription>{tpl.defaultBranch}</DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>SSH Key Name</DescriptionListTerm>
          <DescriptionListDescription>{tpl.sshKeyName || '-'}</DescriptionListDescription>
        </DescriptionListGroup>
      </DescriptionList>
    </PageSection>
  );
};

export default TemplateViewPage;
