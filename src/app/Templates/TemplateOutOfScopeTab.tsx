import * as React from 'react';
import {
  ActionGroup,
  Button,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Form,
  FormGroup,
  Grid,
  GridItem,
  TextArea,
  TextInput,
} from '@patternfly/react-core';
import { OutOfScope } from '@api/templates/types';
import EditableList from './components/EditableList';

interface TemplateOutOfScopeTabProps {
  outOfScope: OutOfScope[];
  onUpdate: (outOfScope: OutOfScope[]) => void;
}

const TemplateOutOfScopeTab: React.FC<TemplateOutOfScopeTabProps> = ({ outOfScope, onUpdate }) => {
  const createEmptyOutOfScope = (): OutOfScope => ({
    phase: '',
    track: '',
    product: '',
    environment: '',
    prefix: '',
    taskDescription: '',
    scopingNotes: '',
  });

  const renderOutOfScope = (item: OutOfScope) => (
    <DescriptionList isHorizontal>
      <DescriptionListGroup>
        <DescriptionListTerm>Phase</DescriptionListTerm>
        <DescriptionListDescription>{item.phase || 'Not specified'}</DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>Track</DescriptionListTerm>
        <DescriptionListDescription>{item.track || 'Not specified'}</DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>Product</DescriptionListTerm>
        <DescriptionListDescription>{item.product || 'Not specified'}</DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>Environment</DescriptionListTerm>
        <DescriptionListDescription>{item.environment || 'Not specified'}</DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>Prefix</DescriptionListTerm>
        <DescriptionListDescription>{item.prefix || 'Not specified'}</DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>Task Description</DescriptionListTerm>
        <DescriptionListDescription>{item.taskDescription}</DescriptionListDescription>
      </DescriptionListGroup>
      {item.scopingNotes && (
        <DescriptionListGroup>
          <DescriptionListTerm>Scoping Notes</DescriptionListTerm>
          <DescriptionListDescription>{item.scopingNotes}</DescriptionListDescription>
        </DescriptionListGroup>
      )}
    </DescriptionList>
  );

  const renderOutOfScopeForm = (
    item: OutOfScope | null,
    onSave: (item: OutOfScope) => void,
    onCancel: () => void,
    form: OutOfScope,
    setForm: React.Dispatch<React.SetStateAction<OutOfScope>>
  ) => {
    const update = <K extends keyof OutOfScope>(key: K, value: OutOfScope[K]) =>
      setForm((prev) => ({ ...prev, [key]: value }));

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave(form);
    };

    return (
      <Form onSubmit={handleSubmit}>
        <Grid hasGutter>
          <GridItem span={6}>
            <FormGroup label="Phase" fieldId="phase">
              <TextInput
                id="phase"
                value={form.phase}
                onChange={(_, v) => update('phase', v)}
                placeholder="e.g., Discovery, Implementation, Testing"
              />
            </FormGroup>
          </GridItem>
          <GridItem span={6}>
            <FormGroup label="Track" fieldId="track">
              <TextInput
                id="track"
                value={form.track}
                onChange={(_, v) => update('track', v)}
                placeholder="e.g., Infrastructure, Security, Application"
              />
            </FormGroup>
          </GridItem>
          <GridItem span={6}>
            <FormGroup label="Product" fieldId="product">
              <TextInput
                id="product"
                value={form.product || ''}
                onChange={(_, v) => update('product', v)}
                placeholder="e.g., OpenShift, Ansible, Kubernetes"
              />
            </FormGroup>
          </GridItem>
          <GridItem span={6}>
            <FormGroup label="Environment" fieldId="environment">
              <TextInput
                id="environment"
                value={form.environment || ''}
                onChange={(_, v) => update('environment', v)}
                placeholder="e.g., Development, Staging, Production"
              />
            </FormGroup>
          </GridItem>
          <GridItem span={6}>
            <FormGroup label="Prefix" fieldId="prefix">
              <TextInput
                id="prefix"
                value={form.prefix || ''}
                onChange={(_, v) => update('prefix', v)}
                placeholder="e.g., OCP, ANS, K8S"
              />
            </FormGroup>
          </GridItem>
          <GridItem span={12}>
            <FormGroup label="Task Description" isRequired fieldId="taskDescription">
              <TextArea
                id="taskDescription"
                value={form.taskDescription}
                onChange={(_, v) => update('taskDescription', v)}
                placeholder="Describe the activity that is out of scope..."
                isRequired
                rows={3}
              />
            </FormGroup>
          </GridItem>
          <GridItem span={12}>
            <FormGroup label="Scoping Notes" fieldId="scopingNotes">
              <TextArea
                id="scopingNotes"
                value={form.scopingNotes || ''}
                onChange={(_, v) => update('scopingNotes', v)}
                placeholder="Additional notes about why this is out of scope or context..."
                rows={3}
              />
            </FormGroup>
          </GridItem>
        </Grid>
        <ActionGroup>
          <Button type="submit" variant="primary">
            Save Out of Scope Item
          </Button>
          <Button variant="link" onClick={onCancel}>
            Cancel
          </Button>
        </ActionGroup>
      </Form>
    );
  };

  const getOutOfScopeKey = (item: OutOfScope, index: number) => 
    `${item.phase}-${item.track}-${item.taskDescription}-${index}`;

  return (
    <EditableList
      title="Out of Scope Activities"
      items={outOfScope}
      onUpdate={onUpdate}
      renderItem={renderOutOfScope}
      renderForm={renderOutOfScopeForm}
      createEmptyItem={createEmptyOutOfScope}
      getItemKey={getOutOfScopeKey}
    />
  );
};

export default TemplateOutOfScopeTab;
