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
import { Prerequisite } from '@api/templates/types';
import EditableList from './components/EditableList';

interface TemplatePrerequisitesTabProps {
  prerequisites: Prerequisite[];
  onUpdate: (prerequisites: Prerequisite[]) => void;
}

const TemplatePrerequisitesTab: React.FC<TemplatePrerequisitesTabProps> = ({ prerequisites, onUpdate }) => {
  const createEmptyPrerequisite = (): Prerequisite => ({
    phase: '',
    track: '',
    product: '',
    environment: '',
    prefix: '',
    assumption: '',
    scopingNotes: '',
  });

  const renderPrerequisite = (item: Prerequisite) => (
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
        <DescriptionListTerm>Assumption</DescriptionListTerm>
        <DescriptionListDescription>{item.assumption}</DescriptionListDescription>
      </DescriptionListGroup>
      {item.scopingNotes && (
        <DescriptionListGroup>
          <DescriptionListTerm>Scoping Notes</DescriptionListTerm>
          <DescriptionListDescription>{item.scopingNotes}</DescriptionListDescription>
        </DescriptionListGroup>
      )}
    </DescriptionList>
  );

  const renderPrerequisiteForm = (
    item: Prerequisite | null,
    onSave: (item: Prerequisite) => void,
    onCancel: () => void,
    form: Prerequisite,
    setForm: React.Dispatch<React.SetStateAction<Prerequisite>>
  ) => {
    const update = <K extends keyof Prerequisite>(key: K, value: Prerequisite[K]) =>
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
            <FormGroup label="Assumption" isRequired fieldId="assumption">
              <TextArea
                id="assumption"
                value={form.assumption}
                onChange={(_, v) => update('assumption', v)}
                placeholder="Describe the prerequisite or assumption..."
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
                placeholder="Additional notes about the assumption or context..."
                rows={3}
              />
            </FormGroup>
          </GridItem>
        </Grid>
        <ActionGroup>
          <Button type="submit" variant="primary">
            Save Prerequisite
          </Button>
          <Button variant="link" onClick={onCancel}>
            Cancel
          </Button>
        </ActionGroup>
      </Form>
    );
  };

  const getPrerequisiteKey = (item: Prerequisite, index: number) => 
    `${item.phase}-${item.track}-${item.assumption}-${index}`;

  return (
    <EditableList
      title="Prerequisites & Assumptions"
      items={prerequisites}
      onUpdate={onUpdate}
      renderItem={renderPrerequisite}
      renderForm={renderPrerequisiteForm}
      createEmptyItem={createEmptyPrerequisite}
      getItemKey={getPrerequisiteKey}
    />
  );
};

export default TemplatePrerequisitesTab;
