import * as React from 'react';
import {
  Alert,
  AlertActionCloseButton,
  Bullseye,
  Button,
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

import { useAuth } from '@app/utils/AuthContext';

const TemplateViewPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getTemplate } = useTemplateService();
  const { user } = useAuth();
  const username = user?.preferred_username;
  const [tpl, setTpl] = React.useState<TemplateDto | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const loadTemplate = async () => {
      if (!username || !id) return;
      try {
        setLoading(true);
        const res = await getTemplate(username, parseInt(id, 10));
        setTpl(res);
      } catch (err) {
        console.error('Failed to load template:', err);
        setError(err instanceof Error ? err.message : 'Failed to load template');
      } finally {
        setLoading(false);
      }
    };

    void loadTemplate();
  }, [getTemplate, id, username]);

  if (error) {
    return (
      <PageSection>
                 <Bullseye>
           <Alert
             variant="danger"
             title="Error loading template"
             actionClose={<AlertActionCloseButton onClose={() => setError(null)} />}
           >
             {error}
           </Alert>
         </Bullseye>
      </PageSection>
    );
  }
  if (loading) {
    return (
      <PageSection>
        <Bullseye>
          <Spinner />
        </Bullseye>
      </PageSection>
    );
  }
  if (!tpl) {
    return (
      <PageSection>
        <Bullseye>
          <Alert variant="info" title="Template not found" />
        </Bullseye>
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
