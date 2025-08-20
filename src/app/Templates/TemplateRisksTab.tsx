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
import { Risk } from '@api/templates/types';
import EditableList from './components/EditableList';

interface TemplateRisksTabProps {
  risks: Risk[];
  onUpdate: (risks: Risk[]) => void;
}

const TemplateRisksTab: React.FC<TemplateRisksTabProps> = ({ risks, onUpdate }) => {
  const createEmptyRisk = (): Risk => ({
    phase: '',
    track: '',
    product: '',
    environment: '',
    prefix: '',
    risk: '',
    chanceOfOccurring: 0,
    impactHoursBestCase: 0,
    impactHoursWorstCase: 0,
    impactHoursMostLikely: 0,
    scopingNotes: '',
  });

  const renderRisk = (risk: Risk) => (
    <DescriptionList isHorizontal>
      <DescriptionListGroup>
        <DescriptionListTerm>Phase</DescriptionListTerm>
        <DescriptionListDescription>{risk.phase || 'Not specified'}</DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>Track</DescriptionListTerm>
        <DescriptionListDescription>{risk.track || 'Not specified'}</DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>Product</DescriptionListTerm>
        <DescriptionListDescription>{risk.product || 'Not specified'}</DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>Environment</DescriptionListTerm>
        <DescriptionListDescription>{risk.environment || 'Not specified'}</DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>Prefix</DescriptionListTerm>
        <DescriptionListDescription>{risk.prefix || 'Not specified'}</DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>Risk</DescriptionListTerm>
        <DescriptionListDescription>{risk.risk}</DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>Chance of Occurring</DescriptionListTerm>
        <DescriptionListDescription>{risk.chanceOfOccurring}%</DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>Impact Hours (Best/Worst/Most Likely)</DescriptionListTerm>
        <DescriptionListDescription>
          {risk.impactHoursBestCase} / {risk.impactHoursWorstCase} / {risk.impactHoursMostLikely}
        </DescriptionListDescription>
      </DescriptionListGroup>
      {risk.scopingNotes && (
        <DescriptionListGroup>
          <DescriptionListTerm>Scoping Notes</DescriptionListTerm>
          <DescriptionListDescription>{risk.scopingNotes}</DescriptionListDescription>
        </DescriptionListGroup>
      )}
    </DescriptionList>
  );

  const renderRiskForm = (
    risk: Risk | null,
    onSave: (risk: Risk) => void,
    onCancel: () => void,
    form: Risk,
    setForm: React.Dispatch<React.SetStateAction<Risk>>
  ) => {
    const update = <K extends keyof Risk>(key: K, value: Risk[K]) =>
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
            <FormGroup label="Risk Description" isRequired fieldId="risk">
              <TextArea
                id="risk"
                value={form.risk}
                onChange={(_, v) => update('risk', v)}
                placeholder="Describe the risk..."
                isRequired
                rows={3}
              />
            </FormGroup>
          </GridItem>
          <GridItem span={4}>
            <FormGroup label="Chance of Occurring (%)" fieldId="chanceOfOccurring">
              <NumberInput
                id="chanceOfOccurring"
                value={form.chanceOfOccurring}
                onMinus={() => update('chanceOfOccurring', Math.max(0, form.chanceOfOccurring - 5))}
                onPlus={() => update('chanceOfOccurring', Math.min(100, form.chanceOfOccurring + 5))}
                onChange={(event) => {
                  const value = parseInt((event.target as HTMLInputElement).value);
                  update('chanceOfOccurring', isNaN(value) ? 0 : Math.max(0, Math.min(100, value)));
                }}
                min={0}
                max={100}
              />
            </FormGroup>
          </GridItem>
          <GridItem span={4}>
            <FormGroup label="Impact Hours (Best Case)" fieldId="impactHoursBestCase">
              <NumberInput
                id="impactHoursBestCase"
                value={form.impactHoursBestCase}
                onMinus={() => update('impactHoursBestCase', Math.max(0, form.impactHoursBestCase - 1))}
                onPlus={() => update('impactHoursBestCase', form.impactHoursBestCase + 1)}
                onChange={(event) => {
                  const value = parseInt((event.target as HTMLInputElement).value);
                  update('impactHoursBestCase', isNaN(value) ? 0 : Math.max(0, value));
                }}
                min={0}
              />
            </FormGroup>
          </GridItem>
          <GridItem span={4}>
            <FormGroup label="Impact Hours (Worst Case)" fieldId="impactHoursWorstCase">
              <NumberInput
                id="impactHoursWorstCase"
                value={form.impactHoursWorstCase}
                onMinus={() => update('impactHoursWorstCase', Math.max(0, form.impactHoursWorstCase - 1))}
                onPlus={() => update('impactHoursWorstCase', form.impactHoursWorstCase + 1)}
                onChange={(event) => {
                  const value = parseInt((event.target as HTMLInputElement).value);
                  update('impactHoursWorstCase', isNaN(value) ? 0 : Math.max(0, value));
                }}
                min={0}
              />
            </FormGroup>
          </GridItem>
          <GridItem span={4}>
            <FormGroup label="Impact Hours (Most Likely)" fieldId="impactHoursMostLikely">
              <NumberInput
                id="impactHoursMostLikely"
                value={form.impactHoursMostLikely}
                onMinus={() => update('impactHoursMostLikely', Math.max(0, form.impactHoursMostLikely - 1))}
                onPlus={() => update('impactHoursMostLikely', form.impactHoursMostLikely + 1)}
                onChange={(event) => {
                  const value = parseInt((event.target as HTMLInputElement).value);
                  update('impactHoursMostLikely', isNaN(value) ? 0 : Math.max(0, value));
                }}
                min={0}
              />
            </FormGroup>
          </GridItem>
          <GridItem span={12}>
            <FormGroup label="Scoping Notes" fieldId="scopingNotes">
              <TextArea
                id="scopingNotes"
                value={form.scopingNotes || ''}
                onChange={(_, v) => update('scopingNotes', v)}
                placeholder="Additional notes about the risk, mitigation strategies, or context..."
                rows={3}
              />
            </FormGroup>
          </GridItem>
        </Grid>
        <ActionGroup>
          <Button type="submit" variant="primary">
            Save Risk
          </Button>
          <Button variant="link" onClick={onCancel}>
            Cancel
          </Button>
        </ActionGroup>
      </Form>
    );
  };

  const getRiskKey = (risk: Risk, index: number) => 
    `${risk.phase}-${risk.track}-${risk.risk}-${index}`;

  return (
    <EditableList
      title="Risks"
      items={risks}
      onUpdate={onUpdate}
      renderItem={renderRisk}
      renderForm={renderRiskForm}
      createEmptyItem={createEmptyRisk}
      getItemKey={getRiskKey}
    />
  );
};

export default TemplateRisksTab;
