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
import { getTemplate } from '@api/templates/service';
import { FilesPayload, TemplateDto } from '@api/templates/types';
import { formatDate } from '@lib/formatters';
import { Button } from '@patternfly/react-core';

const TemplateViewPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [tpl, setTpl] = React.useState<TemplateDto | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function load() {
      if (id) {
        try {
          const res = await getTemplate(id);
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
  }, [id]);

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

  const files: FilesPayload = tpl.files || ({} as FilesPayload);

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
          <DescriptionListTerm>Provider</DescriptionListTerm>
          <DescriptionListDescription>{tpl.provider}</DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Repo</DescriptionListTerm>
          <DescriptionListDescription>{tpl.sshRepoUri}</DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Updated</DescriptionListTerm>
          <DescriptionListDescription>{formatDate(tpl.updatedAt)}</DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Outcomes</DescriptionListTerm>
          <DescriptionListDescription>{files.outcomes?.length || 0}</DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Tasks</DescriptionListTerm>
          <DescriptionListDescription>{files.tasks?.length || 0}</DescriptionListDescription>
        </DescriptionListGroup>
      </DescriptionList>
    </PageSection>
  );
};

export default TemplateViewPage;
