import * as React from 'react';
import {
  Alert,
  AlertActionCloseButton,
  Breadcrumb,
  BreadcrumbItem,
  Page,
  PageSection,
  Spinner,
  Tab,
  TabTitleText,
  Tabs,
  Title,
} from '@patternfly/react-core';
import { useNavigate, useParams } from '@lib/router';
import { useTemplateService } from '@api/templates/service';
import { UpdateTemplateRequest } from '@api/templates/types';
import { useAuth } from '@app/utils/AuthContext';
import TemplateBasicForm from './TemplateBasicForm';
import TemplateOutcomesTab from './TemplateOutcomesTab';
import TemplateTasksTab from './TemplateTasksTab';
import TemplateRisksTab from './TemplateRisksTab';
import TemplateOutOfScopeTab from './TemplateOutOfScopeTab';
import TemplatePrerequisitesTab from './TemplatePrerequisitesTab';
import TemplateTrainingTab from './TemplateTrainingTab';
import TemplateTeamRolesTab from './TemplateTeamRolesTab';
import TemplateTeamModelingTab from './TemplateTeamModelingTab';

const TemplateEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getTemplate, updateTemplate } = useTemplateService();
  const { user } = useAuth();
  const username = user?.preferred_username;
  const [template, setTemplate] = React.useState<UpdateTemplateRequest | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [activeTabKey, setActiveTabKey] = React.useState<string | number>(0);
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    const loadTemplate = async () => {
      if (!username || !id) return;
      try {
        setError(null);
        const tpl = await getTemplate(username, parseInt(id, 10));
        setTemplate(tpl);
      } catch (err) {
        console.error('Failed to load template:', err);
        setError(err instanceof Error ? err.message : 'Failed to load template');
      }
    };

    void loadTemplate();
  }, [getTemplate, id, username]);

  const handleSubmit = async (value: UpdateTemplateRequest) => {
    if (!username || !id) return;
    try {
      setIsSaving(true);
      setError(null);
      await updateTemplate(username, parseInt(id, 10), value);
      navigate('/templates');
    } catch (err) {
      console.error('Failed to update template:', err);
      setError(err instanceof Error ? err.message : 'Failed to update template');
    } finally {
      setIsSaving(false);
    }
  };

  const updateTemplateField = <K extends keyof UpdateTemplateRequest>(
    key: K,
    value: UpdateTemplateRequest[K]
  ) => {
    setTemplate(prev => prev ? { ...prev, [key]: value } : null);
  };

  if (error) {
    return (
      <PageSection>
        <Alert
          variant="danger"
          title="Error"
          actionClose={<AlertActionCloseButton onClose={() => setError(null)} />}
        >
          {error}
        </Alert>
      </PageSection>
    );
  }

  if (!template) {
    return (
      <PageSection>
        <Spinner />
      </PageSection>
    );
  }

  const handleTabClick = (event: React.MouseEvent<HTMLElement, MouseEvent>, tabIndex: string | number) => {
    setActiveTabKey(tabIndex);
  };

  return (
    <Page>
      <PageSection variant="secondary">
        <Breadcrumb>
          <BreadcrumbItem to="/templates">Templates</BreadcrumbItem>
          <BreadcrumbItem to={`/templates/${id}`}>{template.name}</BreadcrumbItem>
          <BreadcrumbItem isActive>Edit</BreadcrumbItem>
        </Breadcrumb>
        <Title headingLevel="h1" size="2xl">
          Edit Template: {template.name}
        </Title>
      </PageSection>

      <PageSection>
        <Tabs
          activeKey={activeTabKey}
          onSelect={handleTabClick}
          isBox
          aria-label="Template edit tabs"
        >
          <Tab eventKey={0} title={<TabTitleText>Basic Details</TabTitleText>}>
            <TemplateBasicForm
              template={template}
              onUpdate={updateTemplateField}
              onSubmit={handleSubmit}
              onCancel={() => navigate(`/templates/${id}`)}
              isSaving={isSaving}
            />
          </Tab>

          <Tab eventKey={1} title={<TabTitleText>Outcomes</TabTitleText>}>
            <TemplateOutcomesTab templateId={parseInt(id!, 10)} />
          </Tab>

          <Tab eventKey={2} title={<TabTitleText>Tasks</TabTitleText>}>
            <TemplateTasksTab
              tasks={template.tasks || []}
              onUpdate={(tasks) => updateTemplateField('tasks', tasks)}
            />
          </Tab>

          <Tab eventKey={3} title={<TabTitleText>Risks</TabTitleText>}>
            <TemplateRisksTab
              risks={template.risks || []}
              onUpdate={(risks) => updateTemplateField('risks', risks)}
            />
          </Tab>

          <Tab eventKey={4} title={<TabTitleText>Out of Scope</TabTitleText>}>
            <TemplateOutOfScopeTab
              outOfScope={template.outOfScope || []}
              onUpdate={(outOfScope) => updateTemplateField('outOfScope', outOfScope)}
            />
          </Tab>

          <Tab eventKey={5} title={<TabTitleText>Prerequisites</TabTitleText>}>
            <TemplatePrerequisitesTab
              prerequisites={template.prerequisites || []}
              onUpdate={(prerequisites) => updateTemplateField('prerequisites', prerequisites)}
            />
          </Tab>

          <Tab eventKey={6} title={<TabTitleText>Training</TabTitleText>}>
            <TemplateTrainingTab
              training={template.training || []}
              onUpdate={(training) => updateTemplateField('training', training)}
            />
          </Tab>

          <Tab eventKey={7} title={<TabTitleText>Team Roles</TabTitleText>}>
            <TemplateTeamRolesTab
              teamRoles={template.teamRoles || []}
              onUpdate={(teamRoles) => updateTemplateField('teamRoles', teamRoles)}
            />
          </Tab>

          <Tab eventKey={8} title={<TabTitleText>Team Modeling</TabTitleText>}>
            <TemplateTeamModelingTab
              teamModeling={template.teamModeling || []}
              onUpdate={(teamModeling) => updateTemplateField('teamModeling', teamModeling)}
            />
          </Tab>
        </Tabs>
      </PageSection>
    </Page>
  );
};

export default TemplateEditPage;
