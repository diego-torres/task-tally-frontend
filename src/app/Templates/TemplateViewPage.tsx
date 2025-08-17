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
          const res = await getTemplate('me', id);
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
          <DescriptionListDescription>{tpl.updatedAt ? formatDate(tpl.updatedAt) : '-'}</DescriptionListDescription>
        </DescriptionListGroup>
        {[
          ['Outcomes', files.outcomes?.length || 0],
          ['Tasks', files.tasks?.length || 0],
          ['Risks', files.risks?.length || 0],
          ['Out of scope', files.outOfScope?.length || 0],
          ['Prereqs', files.prereqs?.length || 0],
          ['Training', files.training?.length || 0],
          ['Team roles', files.teamRoles?.length || 0],
          ['Team modeling', Array.isArray(files.teamModeling) ? files.teamModeling.length : 0],
        ].map(([term, val]) => (
          <DescriptionListGroup key={term as string}>
            <DescriptionListTerm>{term}</DescriptionListTerm>
            <DescriptionListDescription>{val as number}</DescriptionListDescription>
          </DescriptionListGroup>
        ))}
      </DescriptionList>
    </PageSection>
  );
};

export default TemplateViewPage;
