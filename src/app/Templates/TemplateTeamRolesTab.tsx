import * as React from 'react';
import {
  ActionGroup,
  Button,
  Checkbox,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Form,
  FormGroup,
  FormSelect,
  FormSelectOption,
  Grid,
  GridItem,
  NumberInput,
  TextArea,
  TextInput,
} from '@patternfly/react-core';
import { TeamRole } from '@api/templates/types';
import EditableList from './components/EditableList';

interface TemplateTeamRolesTabProps {
  teamRoles: TeamRole[];
  onUpdate: (teamRoles: TeamRole[]) => void;
}

const TemplateTeamRolesTab: React.FC<TemplateTeamRolesTabProps> = ({ teamRoles, onUpdate }) => {
  const createEmptyTeamRole = (): TeamRole => ({
    role: '',
    minimumTitle: '',
    laborCategory: '',
    allowPartialWeeks: false,
    billablePercentage: 100,
    subcontractorPermitted: false,
    primarySkill: '',
    primarySkillLevel: '',
    optionalSkill1: '',
    optionalSkill1Level: '',
    optionalSkill2: '',
    optionalSkill2Level: '',
    optionalSkill3: '',
    optionalSkill3Level: '',
    optionalSkill4: '',
    optionalSkill4Level: '',
    workLocation: '',
    clientSystemKeyboardAccessType: '',
    clearanceRequirements: '',
    otherNotes: '',
  });

  const skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

  const renderTeamRole = (item: TeamRole) => (
    <DescriptionList isHorizontal>
      <DescriptionListGroup>
        <DescriptionListTerm>Role</DescriptionListTerm>
        <DescriptionListDescription>{item.role}</DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>Minimum Title</DescriptionListTerm>
        <DescriptionListDescription>{item.minimumTitle}</DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>Labor Category</DescriptionListTerm>
        <DescriptionListDescription>{item.laborCategory}</DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>Allow Partial Weeks</DescriptionListTerm>
        <DescriptionListDescription>{item.allowPartialWeeks ? 'Yes' : 'No'}</DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>Billable Percentage</DescriptionListTerm>
        <DescriptionListDescription>{item.billablePercentage}%</DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>Subcontractor Permitted</DescriptionListTerm>
        <DescriptionListDescription>{item.subcontractorPermitted ? 'Yes' : 'No'}</DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>Primary Skill</DescriptionListTerm>
        <DescriptionListDescription>{item.primarySkill} ({item.primarySkillLevel})</DescriptionListDescription>
      </DescriptionListGroup>
      {item.optionalSkill1 && (
        <DescriptionListGroup>
          <DescriptionListTerm>Optional Skill 1</DescriptionListTerm>
          <DescriptionListDescription>{item.optionalSkill1} ({item.optionalSkill1Level})</DescriptionListDescription>
        </DescriptionListGroup>
      )}
      {item.optionalSkill2 && (
        <DescriptionListGroup>
          <DescriptionListTerm>Optional Skill 2</DescriptionListTerm>
          <DescriptionListDescription>{item.optionalSkill2} ({item.optionalSkill2Level})</DescriptionListDescription>
        </DescriptionListGroup>
      )}
      {item.optionalSkill3 && (
        <DescriptionListGroup>
          <DescriptionListTerm>Optional Skill 3</DescriptionListTerm>
          <DescriptionListDescription>{item.optionalSkill3} ({item.optionalSkill3Level})</DescriptionListDescription>
        </DescriptionListGroup>
      )}
      {item.optionalSkill4 && (
        <DescriptionListGroup>
          <DescriptionListTerm>Optional Skill 4</DescriptionListTerm>
          <DescriptionListDescription>{item.optionalSkill4} ({item.optionalSkill4Level})</DescriptionListDescription>
        </DescriptionListGroup>
      )}
      <DescriptionListGroup>
        <DescriptionListTerm>Work Location</DescriptionListTerm>
        <DescriptionListDescription>{item.workLocation}</DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>Client System Access</DescriptionListTerm>
        <DescriptionListDescription>{item.clientSystemKeyboardAccessType}</DescriptionListDescription>
      </DescriptionListGroup>
      {item.clearanceRequirements && (
        <DescriptionListGroup>
          <DescriptionListTerm>Clearance Requirements</DescriptionListTerm>
          <DescriptionListDescription>{item.clearanceRequirements}</DescriptionListDescription>
        </DescriptionListGroup>
      )}
      {item.otherNotes && (
        <DescriptionListGroup>
          <DescriptionListTerm>Other Notes</DescriptionListTerm>
          <DescriptionListDescription>{item.otherNotes}</DescriptionListDescription>
        </DescriptionListGroup>
      )}
    </DescriptionList>
  );

  const renderTeamRoleForm = (
    item: TeamRole | null,
    onSave: (item: TeamRole) => void,
    onCancel: () => void,
    form: TeamRole,
    setForm: React.Dispatch<React.SetStateAction<TeamRole>>
  ) => {
    const update = <K extends keyof TeamRole>(key: K, value: TeamRole[K]) =>
      setForm((prev) => ({ ...prev, [key]: value }));

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave(form);
    };

    return (
      <Form onSubmit={handleSubmit}>
        <Grid hasGutter>
          <GridItem span={6}>
            <FormGroup label="Role" isRequired fieldId="role">
              <TextInput
                id="role"
                value={form.role}
                onChange={(_, v) => update('role', v)}
                placeholder="e.g., Senior Consultant, Architect, Developer"
                isRequired
              />
            </FormGroup>
          </GridItem>
          <GridItem span={6}>
            <FormGroup label="Minimum Title" isRequired fieldId="minimumTitle">
              <TextInput
                id="minimumTitle"
                value={form.minimumTitle}
                onChange={(_, v) => update('minimumTitle', v)}
                placeholder="e.g., Senior, Principal, Lead"
                isRequired
              />
            </FormGroup>
          </GridItem>
          <GridItem span={6}>
            <FormGroup label="Labor Category" isRequired fieldId="laborCategory">
              <TextInput
                id="laborCategory"
                value={form.laborCategory}
                onChange={(_, v) => update('laborCategory', v)}
                placeholder="e.g., Technical Consultant, Senior Developer"
                isRequired
              />
            </FormGroup>
          </GridItem>
          <GridItem span={6}>
            <FormGroup label="Billable Percentage" fieldId="billablePercentage">
              <NumberInput
                id="billablePercentage"
                value={form.billablePercentage}
                onMinus={() => update('billablePercentage', Math.max(0, form.billablePercentage - 5))}
                onPlus={() => update('billablePercentage', Math.min(100, form.billablePercentage + 5))}
                onChange={(event) => {
                  const value = parseInt((event.target as HTMLInputElement).value);
                  update('billablePercentage', isNaN(value) ? 0 : Math.max(0, Math.min(100, value)));
                }}
                min={0}
                max={100}
              />
            </FormGroup>
          </GridItem>
          <GridItem span={6}>
            <FormGroup fieldId="allowPartialWeeks">
              <Checkbox
                id="allowPartialWeeks"
                label="Allow Partial Weeks"
                isChecked={form.allowPartialWeeks}
                onChange={(_, checked) => update('allowPartialWeeks', checked)}
              />
            </FormGroup>
          </GridItem>
          <GridItem span={6}>
            <FormGroup fieldId="subcontractorPermitted">
              <Checkbox
                id="subcontractorPermitted"
                label="Subcontractor Permitted"
                isChecked={form.subcontractorPermitted}
                onChange={(_, checked) => update('subcontractorPermitted', checked)}
              />
            </FormGroup>
          </GridItem>
          <GridItem span={6}>
            <FormGroup label="Primary Skill" isRequired fieldId="primarySkill">
              <TextInput
                id="primarySkill"
                value={form.primarySkill}
                onChange={(_, v) => update('primarySkill', v)}
                placeholder="e.g., OpenShift, Ansible, Kubernetes"
                isRequired
              />
            </FormGroup>
          </GridItem>
          <GridItem span={6}>
            <FormGroup label="Primary Skill Level" isRequired fieldId="primarySkillLevel">
              <FormSelect
                id="primarySkillLevel"
                value={form.primarySkillLevel}
                onChange={(_, v) => update('primarySkillLevel', v)}
              >
                <FormSelectOption value="" label="Select level" />
                {skillLevels.map(level => (
                  <FormSelectOption key={level} value={level} label={level} />
                ))}
              </FormSelect>
            </FormGroup>
          </GridItem>
          <GridItem span={6}>
            <FormGroup label="Optional Skill 1" fieldId="optionalSkill1">
              <TextInput
                id="optionalSkill1"
                value={form.optionalSkill1 || ''}
                onChange={(_, v) => update('optionalSkill1', v)}
                placeholder="e.g., Python, Docker, Git"
              />
            </FormGroup>
          </GridItem>
          <GridItem span={6}>
            <FormGroup label="Optional Skill 1 Level" fieldId="optionalSkill1Level">
              <FormSelect
                id="optionalSkill1Level"
                value={form.optionalSkill1Level || ''}
                onChange={(_, v) => update('optionalSkill1Level', v)}
              >
                <FormSelectOption value="" label="Select level" />
                {skillLevels.map(level => (
                  <FormSelectOption key={level} value={level} label={level} />
                ))}
              </FormSelect>
            </FormGroup>
          </GridItem>
          <GridItem span={6}>
            <FormGroup label="Optional Skill 2" fieldId="optionalSkill2">
              <TextInput
                id="optionalSkill2"
                value={form.optionalSkill2 || ''}
                onChange={(_, v) => update('optionalSkill2', v)}
                placeholder="e.g., Python, Docker, Git"
              />
            </FormGroup>
          </GridItem>
          <GridItem span={6}>
            <FormGroup label="Optional Skill 2 Level" fieldId="optionalSkill2Level">
              <FormSelect
                id="optionalSkill2Level"
                value={form.optionalSkill2Level || ''}
                onChange={(_, v) => update('optionalSkill2Level', v)}
              >
                <FormSelectOption value="" label="Select level" />
                {skillLevels.map(level => (
                  <FormSelectOption key={level} value={level} label={level} />
                ))}
              </FormSelect>
            </FormGroup>
          </GridItem>
          <GridItem span={6}>
            <FormGroup label="Optional Skill 3" fieldId="optionalSkill3">
              <TextInput
                id="optionalSkill3"
                value={form.optionalSkill3 || ''}
                onChange={(_, v) => update('optionalSkill3', v)}
                placeholder="e.g., Python, Docker, Git"
              />
            </FormGroup>
          </GridItem>
          <GridItem span={6}>
            <FormGroup label="Optional Skill 3 Level" fieldId="optionalSkill3Level">
              <FormSelect
                id="optionalSkill3Level"
                value={form.optionalSkill3Level || ''}
                onChange={(_, v) => update('optionalSkill3Level', v)}
              >
                <FormSelectOption value="" label="Select level" />
                {skillLevels.map(level => (
                  <FormSelectOption key={level} value={level} label={level} />
                ))}
              </FormSelect>
            </FormGroup>
          </GridItem>
          <GridItem span={6}>
            <FormGroup label="Optional Skill 4" fieldId="optionalSkill4">
              <TextInput
                id="optionalSkill4"
                value={form.optionalSkill4 || ''}
                onChange={(_, v) => update('optionalSkill4', v)}
                placeholder="e.g., Python, Docker, Git"
              />
            </FormGroup>
          </GridItem>
          <GridItem span={6}>
            <FormGroup label="Optional Skill 4 Level" fieldId="optionalSkill4Level">
              <FormSelect
                id="optionalSkill4Level"
                value={form.optionalSkill4Level || ''}
                onChange={(_, v) => update('optionalSkill4Level', v)}
              >
                <FormSelectOption value="" label="Select level" />
                {skillLevels.map(level => (
                  <FormSelectOption key={level} value={level} label={level} />
                ))}
              </FormSelect>
            </FormGroup>
          </GridItem>
          <GridItem span={6}>
            <FormGroup label="Work Location" isRequired fieldId="workLocation">
              <TextInput
                id="workLocation"
                value={form.workLocation}
                onChange={(_, v) => update('workLocation', v)}
                placeholder="e.g., Remote, On-site, Hybrid"
                isRequired
              />
            </FormGroup>
          </GridItem>
          <GridItem span={6}>
            <FormGroup label="Client System Access" isRequired fieldId="clientSystemKeyboardAccessType">
              <TextInput
                id="clientSystemKeyboardAccessType"
                value={form.clientSystemKeyboardAccessType}
                onChange={(_, v) => update('clientSystemKeyboardAccessType', v)}
                placeholder="e.g., VPN, Direct, Cloud"
                isRequired
              />
            </FormGroup>
          </GridItem>
          <GridItem span={12}>
            <FormGroup label="Clearance Requirements" fieldId="clearanceRequirements">
              <TextInput
                id="clearanceRequirements"
                value={form.clearanceRequirements || ''}
                onChange={(_, v) => update('clearanceRequirements', v)}
                placeholder="e.g., Secret, Top Secret, None"
              />
            </FormGroup>
          </GridItem>
          <GridItem span={12}>
            <FormGroup label="Other Notes" fieldId="otherNotes">
              <TextArea
                id="otherNotes"
                value={form.otherNotes || ''}
                onChange={(_, v) => update('otherNotes', v)}
                placeholder="Additional notes about the role, requirements, or context..."
                rows={3}
              />
            </FormGroup>
          </GridItem>
        </Grid>
        <ActionGroup>
          <Button type="submit" variant="primary">
            Save Team Role
          </Button>
          <Button variant="link" onClick={onCancel}>
            Cancel
          </Button>
        </ActionGroup>
      </Form>
    );
  };

  const getTeamRoleKey = (item: TeamRole, index: number) => 
    `${item.role}-${item.minimumTitle}-${index}`;

  return (
    <EditableList
      title="Team Roles"
      items={teamRoles}
      onUpdate={onUpdate}
      renderItem={renderTeamRole}
      renderForm={renderTeamRoleForm}
      createEmptyItem={createEmptyTeamRole}
      getItemKey={getTeamRoleKey}
    />
  );
};

export default TemplateTeamRolesTab;
