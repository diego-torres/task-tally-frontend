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
import { Outcome } from '@api/templates/types';
import EditableList from './components/EditableList';

interface TemplateOutcomesTabProps {
  outcomes: Outcome[];
  onUpdate: (outcomes: Outcome[]) => void;
}

const TemplateOutcomesTab: React.FC<TemplateOutcomesTabProps> = ({ outcomes, onUpdate }) => {
  const createEmptyOutcome = (): Outcome => ({
    phase: '',
    track: '',
    product: '',
    environment: '',
    prefix: '',
    outcomeText: '',
    scopingNotes: '',
  });

  const renderOutcome = (outcome: Outcome) => (
    <DescriptionList isHorizontal>
      <DescriptionListGroup>
        <DescriptionListTerm>Phase</DescriptionListTerm>
        <DescriptionListDescription>{outcome.phase || 'Not specified'}</DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>Track</DescriptionListTerm>
        <DescriptionListDescription>{outcome.track || 'Not specified'}</DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>Product</DescriptionListTerm>
        <DescriptionListDescription>{outcome.product || 'Not specified'}</DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>Environment</DescriptionListTerm>
        <DescriptionListDescription>{outcome.environment || 'Not specified'}</DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>Prefix</DescriptionListTerm>
        <DescriptionListDescription>{outcome.prefix || 'Not specified'}</DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>Outcome</DescriptionListTerm>
        <DescriptionListDescription>{outcome.outcomeText}</DescriptionListDescription>
      </DescriptionListGroup>
      {outcome.scopingNotes && (
        <DescriptionListGroup>
          <DescriptionListTerm>Scoping Notes</DescriptionListTerm>
          <DescriptionListDescription>{outcome.scopingNotes}</DescriptionListDescription>
        </DescriptionListGroup>
      )}
    </DescriptionList>
  );

  const renderOutcomeForm = (
    outcome: Outcome | null,
    onSave: (outcome: Outcome) => void,
    onCancel: () => void,
    form: Outcome,
    setForm: React.Dispatch<React.SetStateAction<Outcome>>
  ) => {
    const update = <K extends keyof Outcome>(key: K, value: Outcome[K]) =>
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
            <FormGroup label="Outcome Text" isRequired fieldId="outcomeText">
              <TextArea
                id="outcomeText"
                value={form.outcomeText}
                onChange={(_, v) => update('outcomeText', v)}
                placeholder="Describe the expected outcome from this consulting effort..."
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
                placeholder="Additional notes about scope, assumptions, or context..."
                rows={3}
              />
            </FormGroup>
          </GridItem>
        </Grid>
        <ActionGroup>
          <Button type="submit" variant="primary">
            Save Outcome
          </Button>
          <Button variant="link" onClick={onCancel}>
            Cancel
          </Button>
        </ActionGroup>
      </Form>
    );
  };

  const getOutcomeKey = (outcome: Outcome, index: number) => 
    `${outcome.phase}-${outcome.track}-${outcome.outcomeText}-${index}`;

  return (
    <EditableList
      title="Outcomes"
      items={outcomes}
      onUpdate={onUpdate}
      renderItem={renderOutcome}
      renderForm={renderOutcomeForm}
      createEmptyItem={createEmptyOutcome}
      getItemKey={getOutcomeKey}
    />
  );
};

export default TemplateOutcomesTab;
