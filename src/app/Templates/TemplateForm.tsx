import * as React from 'react';
import {
  ActionGroup,
  Button,
  Form,
  FormGroup,
  FormSelect,
  FormSelectOption,
  PageSection,
  TextArea,
  TextInput,
} from '@patternfly/react-core';
import { CreateTemplateRequest, Provider, UpdateTemplateRequest } from '@api/templates/types';
import { useCredentialService } from '@api/credentials/service';
import { CredentialDto } from '@api/credentials/types';
import { useAuth } from '@app/utils/AuthContext';

type Mode = 'create' | 'edit';

export interface TemplateFormProps {
  mode: Mode;
  initial?: Partial<CreateTemplateRequest>;
  onSubmit: (payload: CreateTemplateRequest | UpdateTemplateRequest) => void;
  onCancel?: () => void;
}

const TemplateForm: React.FC<TemplateFormProps> = ({ mode, initial, onSubmit, onCancel }) => {
  const [form, setForm] = React.useState<CreateTemplateRequest>({
    name: initial?.name || '',
    description: initial?.description,
    provider: (initial?.provider as Provider) || 'github',
    repositoryUrl: initial?.repositoryUrl || '',
    defaultBranch: initial?.defaultBranch || 'main',
    sshKeyName: initial?.sshKeyName,
  });

  const update = <K extends keyof CreateTemplateRequest>(key: K, value: CreateTemplateRequest[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const [credentials, setCredentials] = React.useState<CredentialDto[]>([]);

  const { listSshKeys } = useCredentialService();
  const { user } = useAuth();
  const username = user?.preferred_username;

  React.useEffect(() => {
    if (!username) return;
    listSshKeys(username)
      .then(setCredentials)
      .catch(() => setCredentials([]));
  }, [listSshKeys, username]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <PageSection>
      <Form isWidthLimited onSubmit={handleSubmit}>
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
        <FormGroup label="Repository URL" isRequired fieldId="repo">
          <TextInput id="repo" value={form.repositoryUrl} onChange={(_, v) => update('repositoryUrl', v)} isRequired />
        </FormGroup>
        <FormGroup label="Default branch" fieldId="branch">
          <TextInput id="branch" value={form.defaultBranch} onChange={(_, v) => update('defaultBranch', v)} />
        </FormGroup>
        <FormGroup label="SSH key" fieldId="sshKey">
          <FormSelect
            id="sshKey"
            value={form.sshKeyName || ''}
            onChange={(_, v) => update('sshKeyName', v || undefined)}
          >
            <FormSelectOption value="" label="None" />
            {credentials.map((c) => (
              <FormSelectOption key={c.name} value={c.name} label={c.name} />
            ))}
          </FormSelect>
        </FormGroup>
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
