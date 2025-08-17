import * as React from 'react';
import {
  ActionGroup,
  Button,
  Form,
  FormGroup,
  FormSelect,
  FormSelectOption,
  PageSection,
  Tab,
  Tabs,
  TextArea,
  TextInput,
} from '@patternfly/react-core';
import { TrashIcon } from '@patternfly/react-icons';
import { CreateTemplateRequest, FilesPayload, Provider, UpdateTemplateRequest } from '@api/templates/types';
import { listSshKeys } from '@api/credentials/service';
import { CredentialDto } from '@api/credentials/types';

type Mode = 'create' | 'edit';

export interface TemplateFormProps {
  mode: Mode;
  initial?: Partial<CreateTemplateRequest>;
  onSubmit: (payload: CreateTemplateRequest | UpdateTemplateRequest) => void;
  onCancel?: () => void;
}

const emptyFiles: FilesPayload = {
  template: {},
  outcomes: [],
  tasks: [],
  risks: [],
  outOfScope: [],
  prereqs: [],
  training: [],
  teamRoles: [],
  teamModeling: [],
};

const TemplateForm: React.FC<TemplateFormProps> = ({ mode, initial, onSubmit, onCancel }) => {
  const [form, setForm] = React.useState<CreateTemplateRequest>({
    name: initial?.name || '',
    description: initial?.description,
    provider: (initial?.provider as Provider) || 'github',
    sshRepoUri: initial?.sshRepoUri || '',
    defaultBranch: initial?.defaultBranch || 'main',
    credentialName: initial?.credentialName,
    files: initial?.files || emptyFiles,
  });

  const update = <K extends keyof CreateTemplateRequest>(key: K, value: CreateTemplateRequest[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const [activeKey, setActiveKey] = React.useState(0);
  const [credentials, setCredentials] = React.useState<CredentialDto[]>([]);

  React.useEffect(() => {
    listSshKeys('me')
      .then(setCredentials)
      .catch(() => setCredentials([]));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: CreateTemplateRequest | UpdateTemplateRequest = {
      ...form,
      ...(mode === 'create' ? { files: undefined } : { files: form.files }),
    };
    onSubmit(payload);
  };

  const renderCoreFields = () => (
    <>
      <FormGroup label="Name" isRequired fieldId="name">
        <TextInput id="name" value={form.name} onChange={(_, v) => update('name', v)} isRequired />
      </FormGroup>
      <FormGroup label="Description" fieldId="description">
        <TextArea id="description" value={form.description || ''} onChange={(_, v) => update('description', v)} />
      </FormGroup>
      <FormGroup label="Provider" fieldId="provider">
        <FormSelect id="provider" value={form.provider} onChange={(_, v) => update('provider', v as Provider)}>
          <FormSelectOption value="github" label="GitHub" />
          <FormSelectOption value="gitlab" label="GitLab" />
        </FormSelect>
      </FormGroup>
      <FormGroup label="Repository" isRequired fieldId="repo">
        <TextInput id="repo" value={form.sshRepoUri} onChange={(_, v) => update('sshRepoUri', v)} isRequired />
      </FormGroup>
      <FormGroup label="Default branch" fieldId="branch">
        <TextInput id="branch" value={form.defaultBranch} onChange={(_, v) => update('defaultBranch', v)} />
      </FormGroup>
      <FormGroup label="SSH key" fieldId="credential">
        <FormSelect
          id="credential"
          value={form.credentialName || ''}
          onChange={(_, v) => update('credentialName', v || undefined)}
        >
          <FormSelectOption value="" label="None" />
          {credentials.map((c) => (
            <FormSelectOption key={c.name} value={c.name} label={c.name || ''} />
          ))}
        </FormSelect>
      </FormGroup>
    </>
  );

  const renderSimpleTab = (eventKey: number, label: string, key: keyof FilesPayload) => {
    const items = (form.files?.[key] as { name?: string }[]) || [];
    const updateItems = (next: { name?: string }[]) => update('files', { ...(form.files || emptyFiles), [key]: next });

    const add = () => updateItems([...items, { name: '' }]);
    const remove = (idx: number) => {
      const copy = [...items];
      copy.splice(idx, 1);
      updateItems(copy);
    };
    const change = (idx: number, value: string) => {
      const copy = [...items];
      copy[idx] = { ...copy[idx], name: value };
      updateItems(copy);
    };

    return (
      <Tab eventKey={eventKey} title={label}>
        <div style={{ overflowX: 'auto' }}>
          <table className="pf-c-table pf-m-compact" role="grid" style={{ width: '100%', minWidth: '300px' }}>
            <thead>
              <tr>
                <th>Name</th>
                <th style={{ width: '40px' }} />
              </tr>
            </thead>
            <tbody>
              {items.map((it, idx) => (
                <tr key={idx}>
                  <td>
                    <TextInput
                      value={it.name || ''}
                      onChange={(_, v) => change(idx, v)}
                      aria-label={`${label.toLowerCase()}-${idx}`}
                    />
                  </td>
                  <td>
                    <Button variant="plain" aria-label="Remove" onClick={() => remove(idx)}>
                      <TrashIcon />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Button variant="link" onClick={add}>
          Add {label.slice(0, -1).toLowerCase()}
        </Button>
      </Tab>
    );
  };

  const renderTeamModelingTab = (eventKey: number) => {
    interface TeamModel {
      role?: string;
      task?: string;
      estimateHours?: number;
    }
    const items = (form.files?.teamModeling as TeamModel[]) || [];
    const updateItems = (next: TeamModel[]) => update('files', { ...(form.files || emptyFiles), teamModeling: next });

    const add = () => updateItems([...items, { role: '', task: '', estimateHours: 0 }]);
    const remove = (idx: number) => {
      const copy = [...items];
      copy.splice(idx, 1);
      updateItems(copy);
    };
    const change = (idx: number, field: string, value: string) => {
      const copy = [...items];
      copy[idx] = { ...copy[idx], [field]: value };
      updateItems(copy);
    };

    return (
      <Tab eventKey={eventKey} title="Team Modeling">
        <div style={{ overflowX: 'auto' }}>
          <table className="pf-c-table pf-m-compact" role="grid" style={{ width: '100%', minWidth: '400px' }}>
            <thead>
              <tr>
                <th>Role</th>
                <th>Task</th>
                <th>Hours</th>
                <th style={{ width: '40px' }} />
              </tr>
            </thead>
            <tbody>
              {items.map((it, idx) => (
                <tr key={idx}>
                  <td>
                    <TextInput
                      value={it.role || ''}
                      onChange={(_, v) => change(idx, 'role', v)}
                      aria-label={`team-role-${idx}`}
                    />
                  </td>
                  <td>
                    <TextInput
                      value={it.task || ''}
                      onChange={(_, v) => change(idx, 'task', v)}
                      aria-label={`team-task-${idx}`}
                    />
                  </td>
                  <td>
                    <TextInput
                      type="number"
                      value={it.estimateHours ?? ''}
                      onChange={(_, v) => change(idx, 'estimateHours', v)}
                      aria-label={`team-hours-${idx}`}
                    />
                  </td>
                  <td>
                    <Button variant="plain" aria-label="Remove" onClick={() => remove(idx)}>
                      <TrashIcon />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Button variant="link" onClick={add}>
          Add team model
        </Button>
      </Tab>
    );
  };

  return (
    <PageSection>
      <Form isWidthLimited onSubmit={handleSubmit}>
        {mode === 'edit' ? (
          <Tabs activeKey={activeKey} onSelect={(_, k) => setActiveKey(Number(k))}>
            <Tab eventKey={0} title="Core">
              {renderCoreFields()}
            </Tab>
            {renderSimpleTab(1, 'Outcomes', 'outcomes')}
            {renderSimpleTab(2, 'Tasks', 'tasks')}
            {renderSimpleTab(3, 'Risks', 'risks')}
            {renderSimpleTab(4, 'Out-of-Scope', 'outOfScope')}
            {renderSimpleTab(5, 'Prereqs', 'prereqs')}
            {renderSimpleTab(6, 'Training', 'training')}
            {renderSimpleTab(7, 'Team Roles', 'teamRoles')}
            {renderTeamModelingTab(8)}
          </Tabs>
        ) : (
          renderCoreFields()
        )}
        <ActionGroup>
          <Button type="submit" variant="primary">
            {mode === 'create' ? 'Create' : 'Save'}
          </Button>
          {onCancel && (
            <Button variant="link" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </ActionGroup>
      </Form>
    </PageSection>
  );
};

export type { Mode };
export default TemplateForm;
