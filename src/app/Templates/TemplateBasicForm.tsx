import * as React from 'react';
import {
  ActionGroup,
  Button,
  Form,
  FormGroup,
  FormSelect,
  FormSelectOption,
  TextArea,
  TextInput,
  Tooltip,
} from '@patternfly/react-core';
import { QuestionCircleIcon } from '@patternfly/react-icons';
import { Provider, UpdateTemplateRequest } from '@api/templates/types';
import { useCredentialService } from '@api/credentials/service';
import { CredentialDto } from '@api/credentials/types';
import { useAuth } from '@app/utils/AuthContext';

export interface TemplateBasicFormProps {
  template: UpdateTemplateRequest;
  onUpdate: <K extends keyof UpdateTemplateRequest>(key: K, value: UpdateTemplateRequest[K]) => void;
  onSubmit: (template: UpdateTemplateRequest) => void;
  onCancel: () => void;
  isSaving: boolean;
}

const TemplateBasicForm: React.FC<TemplateBasicFormProps> = ({ 
  template, 
  onUpdate, 
  onSubmit, 
  onCancel, 
  isSaving 
}) => {
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
    onSubmit(template);
  };

  return (
    <Form isWidthLimited onSubmit={handleSubmit}>
      <FormGroup label="Name" isRequired fieldId="name">
        <TextInput 
          id="name" 
          value={template.name} 
          onChange={(_, v) => onUpdate('name', v)} 
          isRequired 
        />
      </FormGroup>
      
      <FormGroup label="Description" fieldId="description">
        <TextArea 
          id="description" 
          value={template.description || ''} 
          onChange={(_, v) => onUpdate('description', v)} 
        />
      </FormGroup>
      
      <FormGroup label="Provider" fieldId="provider">
        <FormSelect 
          id="provider" 
          value={template.provider} 
          onChange={(_, v) => onUpdate('provider', v as Provider)}
        >
          <FormSelectOption value="github" label="GitHub" />
          <FormSelectOption value="gitlab" label="GitLab" />
        </FormSelect>
      </FormGroup>
      
      <FormGroup 
        label={
          <span>
            Repository URL
            <Tooltip
              content="Use SSH format: git@github.com:username/repository.git or git@gitlab.com:username/repository.git"
              position="top"
            >
              <Button
                variant="plain"
                aria-label="Repository URL help"
                style={{ marginLeft: '8px', padding: '0' }}
              >
                <QuestionCircleIcon />
              </Button>
            </Tooltip>
          </span>
        } 
        isRequired 
        fieldId="repo"
      >
        <TextInput 
          id="repo" 
          value={template.repositoryUrl} 
          onChange={(_, v) => onUpdate('repositoryUrl', v)} 
          isRequired 
        />
      </FormGroup>
      
      <FormGroup label="Default branch" fieldId="branch">
        <TextInput 
          id="branch" 
          value={template.defaultBranch} 
          onChange={(_, v) => onUpdate('defaultBranch', v)} 
        />
      </FormGroup>
      
      <FormGroup label="SSH key" fieldId="sshKey">
        <FormSelect
          id="sshKey"
          value={template.sshKeyName || ''}
          onChange={(_, v) => onUpdate('sshKeyName', v || undefined)}
        >
          <FormSelectOption value="" label="None" />
          {credentials.map((c) => (
            <FormSelectOption key={c.name} value={c.name} label={c.name} />
          ))}
        </FormSelect>
      </FormGroup>
      
      <ActionGroup>
        <Button type="submit" variant="primary" isDisabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Template'}
        </Button>
        <Button variant="link" onClick={onCancel} isDisabled={isSaving}>
          Cancel
        </Button>
      </ActionGroup>
    </Form>
  );
};

export default TemplateBasicForm;

