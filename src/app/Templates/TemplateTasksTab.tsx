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
  NumberInput,
  TextArea,
  TextInput,
} from '@patternfly/react-core';
import { Task } from '@api/templates/types';
import EditableList from './components/EditableList';

interface TemplateTasksTabProps {
  tasks: Task[];
  onUpdate: (tasks: Task[]) => void;
}

const TemplateTasksTab: React.FC<TemplateTasksTabProps> = ({ tasks, onUpdate }) => {
  const createEmptyTask = (): Task => ({
    phase: '',
    track: '',
    product: '',
    environment: '',
    prefix: '',
    taskDescription: '',
    hoursBestCase: 0,
    hoursWorstCase: 0,
    hoursMostLikely: 0,
    deliveryGuidance: '',
    scopingNotes: '',
  });

  const renderTask = (task: Task) => (
    <DescriptionList isHorizontal>
      <DescriptionListGroup>
        <DescriptionListTerm>Phase</DescriptionListTerm>
        <DescriptionListDescription>{task.phase || 'Not specified'}</DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>Track</DescriptionListTerm>
        <DescriptionListDescription>{task.track || 'Not specified'}</DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>Product</DescriptionListTerm>
        <DescriptionListDescription>{task.product || 'Not specified'}</DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>Environment</DescriptionListTerm>
        <DescriptionListDescription>{task.environment || 'Not specified'}</DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>Prefix</DescriptionListTerm>
        <DescriptionListDescription>{task.prefix || 'Not specified'}</DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>Task Description</DescriptionListTerm>
        <DescriptionListDescription>{task.taskDescription}</DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>Hours (Best/Worst/Most Likely)</DescriptionListTerm>
        <DescriptionListDescription>
          {task.hoursBestCase} / {task.hoursWorstCase} / {task.hoursMostLikely}
        </DescriptionListDescription>
      </DescriptionListGroup>
      {task.deliveryGuidance && (
        <DescriptionListGroup>
          <DescriptionListTerm>Delivery Guidance</DescriptionListTerm>
          <DescriptionListDescription>{task.deliveryGuidance}</DescriptionListDescription>
        </DescriptionListGroup>
      )}
      {task.scopingNotes && (
        <DescriptionListGroup>
          <DescriptionListTerm>Scoping Notes</DescriptionListTerm>
          <DescriptionListDescription>{task.scopingNotes}</DescriptionListDescription>
        </DescriptionListGroup>
      )}
    </DescriptionList>
  );

  const renderTaskForm = (
    task: Task | null,
    onSave: (task: Task) => void,
    onCancel: () => void,
    form: Task,
    setForm: React.Dispatch<React.SetStateAction<Task>>
  ) => {
    const update = <K extends keyof Task>(key: K, value: Task[K]) =>
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
                placeholder="Describe the task to be completed..."
                isRequired
                rows={3}
              />
            </FormGroup>
          </GridItem>
          <GridItem span={4}>
            <FormGroup label="Hours (Best Case)" fieldId="hoursBestCase">
              <NumberInput
                id="hoursBestCase"
                value={form.hoursBestCase}
                onMinus={() => update('hoursBestCase', Math.max(0, form.hoursBestCase - 1))}
                onPlus={() => update('hoursBestCase', form.hoursBestCase + 1)}
                onChange={(event) => {
                  const value = parseInt((event.target as HTMLInputElement).value);
                  update('hoursBestCase', isNaN(value) ? 0 : Math.max(0, value));
                }}
                min={0}
              />
            </FormGroup>
          </GridItem>
          <GridItem span={4}>
            <FormGroup label="Hours (Worst Case)" fieldId="hoursWorstCase">
              <NumberInput
                id="hoursWorstCase"
                value={form.hoursWorstCase}
                onMinus={() => update('hoursWorstCase', Math.max(0, form.hoursWorstCase - 1))}
                onPlus={() => update('hoursWorstCase', form.hoursWorstCase + 1)}
                onChange={(event) => {
                  const value = parseInt((event.target as HTMLInputElement).value);
                  update('hoursWorstCase', isNaN(value) ? 0 : Math.max(0, value));
                }}
                min={0}
              />
            </FormGroup>
          </GridItem>
          <GridItem span={4}>
            <FormGroup label="Hours (Most Likely)" fieldId="hoursMostLikely">
              <NumberInput
                id="hoursMostLikely"
                value={form.hoursMostLikely}
                onMinus={() => update('hoursMostLikely', Math.max(0, form.hoursMostLikely - 1))}
                onPlus={() => update('hoursMostLikely', form.hoursMostLikely + 1)}
                onChange={(event) => {
                  const value = parseInt((event.target as HTMLInputElement).value);
                  update('hoursMostLikely', isNaN(value) ? 0 : Math.max(0, value));
                }}
                min={0}
              />
            </FormGroup>
          </GridItem>
          <GridItem span={12}>
            <FormGroup label="Delivery Guidance" fieldId="deliveryGuidance">
              <TextArea
                id="deliveryGuidance"
                value={form.deliveryGuidance || ''}
                onChange={(_, v) => update('deliveryGuidance', v)}
                placeholder="Guidance on how to deliver this task..."
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
                placeholder="Additional notes about scope, assumptions, or context..."
                rows={3}
              />
            </FormGroup>
          </GridItem>
        </Grid>
        <ActionGroup>
          <Button type="submit" variant="primary">
            Save Task
          </Button>
          <Button variant="link" onClick={onCancel}>
            Cancel
          </Button>
        </ActionGroup>
      </Form>
    );
  };

  const getTaskKey = (task: Task, index: number) => 
    `${task.phase}-${task.track}-${task.taskDescription}-${index}`;

  return (
    <EditableList
      title="Tasks"
      items={tasks}
      onUpdate={onUpdate}
      renderItem={renderTask}
      renderForm={renderTaskForm}
      createEmptyItem={createEmptyTask}
      getItemKey={getTaskKey}
    />
  );
};

export default TemplateTasksTab;
