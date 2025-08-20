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
import { Training } from '@api/templates/types';
import EditableList from './components/EditableList';

interface TemplateTrainingTabProps {
  training: Training[];
  onUpdate: (training: Training[]) => void;
}

const TemplateTrainingTab: React.FC<TemplateTrainingTabProps> = ({ training, onUpdate }) => {
  const createEmptyTraining = (): Training => ({
    phase: '',
    track: '',
    product: '',
    environment: '',
    prefix: '',
    clientRole: '',
    courseName: '',
    courseDescription: '',
    scopingNotes: '',
  });

  const renderTraining = (item: Training) => (
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
        <DescriptionListTerm>Client Role</DescriptionListTerm>
        <DescriptionListDescription>{item.clientRole}</DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>Course Name</DescriptionListTerm>
        <DescriptionListDescription>{item.courseName}</DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>Course Description</DescriptionListTerm>
        <DescriptionListDescription>{item.courseDescription}</DescriptionListDescription>
      </DescriptionListGroup>
      {item.scopingNotes && (
        <DescriptionListGroup>
          <DescriptionListTerm>Scoping Notes</DescriptionListTerm>
          <DescriptionListDescription>{item.scopingNotes}</DescriptionListDescription>
        </DescriptionListGroup>
      )}
    </DescriptionList>
  );

  const renderTrainingForm = (
    item: Training | null,
    onSave: (item: Training) => void,
    onCancel: () => void,
    form: Training,
    setForm: React.Dispatch<React.SetStateAction<Training>>
  ) => {
    const update = <K extends keyof Training>(key: K, value: Training[K]) =>
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
          <GridItem span={6}>
            <FormGroup label="Client Role" isRequired fieldId="clientRole">
              <TextInput
                id="clientRole"
                value={form.clientRole}
                onChange={(_, v) => update('clientRole', v)}
                placeholder="e.g., Administrator, Developer, Architect"
                isRequired
              />
            </FormGroup>
          </GridItem>
          <GridItem span={12}>
            <FormGroup label="Course Name" isRequired fieldId="courseName">
              <TextInput
                id="courseName"
                value={form.courseName}
                onChange={(_, v) => update('courseName', v)}
                placeholder="e.g., OpenShift Administration, Ansible Automation"
                isRequired
              />
            </FormGroup>
          </GridItem>
          <GridItem span={12}>
            <FormGroup label="Course Description" isRequired fieldId="courseDescription">
              <TextArea
                id="courseDescription"
                value={form.courseDescription}
                onChange={(_, v) => update('courseDescription', v)}
                placeholder="Describe the training course and its objectives..."
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
                placeholder="Additional notes about training requirements, timing, or context..."
                rows={3}
              />
            </FormGroup>
          </GridItem>
        </Grid>
        <ActionGroup>
          <Button type="submit" variant="primary">
            Save Training
          </Button>
          <Button variant="link" onClick={onCancel}>
            Cancel
          </Button>
        </ActionGroup>
      </Form>
    );
  };

  const getTrainingKey = (item: Training, index: number) => 
    `${item.phase}-${item.track}-${item.courseName}-${index}`;

  return (
    <EditableList
      title="Recommended Training"
      items={training}
      onUpdate={onUpdate}
      renderItem={renderTraining}
      renderForm={renderTrainingForm}
      createEmptyItem={createEmptyTraining}
      getItemKey={getTrainingKey}
    />
  );
};

export default TemplateTrainingTab;
