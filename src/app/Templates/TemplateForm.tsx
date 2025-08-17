import * as React from 'react';
import {
  Button,
  ExpandableSection,
  Form,
  FormGroup,
  FormSelect,
  FormSelectOption,
  TextArea,
  TextInput,
} from '@patternfly/react-core';
import {
  CreateTemplateRequest,
  FilesPayload,
  OutOfScopeItem,
  Outcome,
  PrereqItem,
  Risk,
  Task,
  TeamModelingItem,
  TeamRole,
  TrainingItem,
} from '@api/templates/types';

interface TemplateFormProps {
  initial?: Partial<CreateTemplateRequest>;
  onSubmit: (value: CreateTemplateRequest) => void;
  submitLabel?: string;
}

const emptyFiles: FilesPayload = {
  template: { name: '' },
  outcomes: [],
  tasks: [],
  risks: [],
  outOfScope: [],
  prereqs: [],
  training: [],
  teamRoles: [],
  teamModeling: [],
};

function useListState<T>(initial: T[]): [T[], (items: T[]) => void, () => void] {
  const [items, setItems] = React.useState<T[]>(initial);
  const add = () => setItems([...items, {} as T]);
  return [items, setItems, add];
}

const TemplateForm: React.FC<TemplateFormProps> = ({
  initial,
  onSubmit,
  submitLabel = 'Save',
}) => {
  const [form, setForm] = React.useState<CreateTemplateRequest>({
    name: initial?.name || '',
    description: initial?.description,
    provider: initial?.provider || 'github',
    sshRepoUri: initial?.sshRepoUri || '',
    defaultBranch: initial?.defaultBranch || 'main',
    credentialName: initial?.credentialName || '',
    files: initial?.files || emptyFiles,
  });

  const update = <K extends keyof CreateTemplateRequest>(
    field: K,
    value: CreateTemplateRequest[K],
  ) => setForm((prev) => ({ ...prev, [field]: value }));

  const submit = (e: React.FormEvent) => {
  e.preventDefault();
  onSubmit(form);
};

  const [outcomes, setOutcomes, addOutcome] = useListState<Outcome>(
    form.files.outcomes || [],
  );
  const [tasks, setTasks, addTask] = useListState<Task>(
    form.files.tasks || [],
  );
  const [risks, setRisks, addRisk] = useListState<Risk>(form.files.risks || []);
  const [outOfScope, setOutOfScope, addOut] = useListState<OutOfScopeItem>(
    form.files.outOfScope || [],
  );
  const [prereqs, setPrereqs, addPrereq] = useListState<PrereqItem>(
    form.files.prereqs || [],
  );
  const [training, setTraining, addTraining] = useListState<TrainingItem>(
    form.files.training || [],
  );
  const [teamRoles, setTeamRoles, addRole] = useListState<TeamRole>(
    form.files.teamRoles || [],
  );
  const [teamModeling, setTeamModeling, addModel] =
    useListState<TeamModelingItem>(form.files.teamModeling || []);

  React.useEffect(() => {
    update('files', {
      template: form.files.template,
      outcomes,
      tasks,
      risks,
      outOfScope,
      prereqs,
      training,
      teamRoles,
      teamModeling,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    outcomes,
    tasks,
    risks,
    outOfScope,
    prereqs,
    training,
    teamRoles,
    teamModeling,
  ]);

  return (
    <Form onSubmit={submit}>
      <FormGroup label="Name" isRequired fieldId="name">
        <TextInput
          id="name"
          value={form.name}
          onChange={(_, v) => {
            update('name', v);
            setForm((prev) => ({
              ...prev,
              files: {
                ...prev.files,
                template: { ...prev.files.template, name: v },
              },
            }));
          }}
        />
      </FormGroup>
      <FormGroup label="Description" fieldId="description">
        <TextArea
          id="description"
          value={form.description}
          onChange={(_, v) => {
            update('description', v);
            setForm((prev) => ({
              ...prev,
              files: {
                ...prev.files,
                template: { ...prev.files.template, description: v },
              },
            }));
          }}
        />
      </FormGroup>
      <FormGroup label="Provider" isRequired fieldId="provider">
        <FormSelect
          value={form.provider}
          onChange={(_, value) =>
            update('provider', value as 'github' | 'gitlab')}
          id="provider"
        >
          <FormSelectOption value="github" label="GitHub" />
          <FormSelectOption value="gitlab" label="GitLab" />
        </FormSelect>
      </FormGroup>
      <FormGroup label="Repository" isRequired fieldId="repo">
        <TextInput
          id="repo"
          value={form.sshRepoUri}
          onChange={(_, v) => update('sshRepoUri', v)}
        />
      </FormGroup>
      <FormGroup label="Default branch" fieldId="branch">
        <TextInput
          id="branch"
          value={form.defaultBranch}
          onChange={(_, v) => update('defaultBranch', v)}
        />
      </FormGroup>
      <FormGroup label="Credential" isRequired fieldId="credential">
        <TextInput
          id="credential"
          value={form.credentialName}
          onChange={(_, v) => update('credentialName', v)}
        />
      </FormGroup>

      <ExpandableSection toggleText="Outcomes">
        {outcomes.map((o, idx) => (
          <TextInput
            key={idx}
            value={o.name}
            onChange={(_, v) => {
              const copy = [...outcomes];
              copy[idx] = { ...copy[idx], name: v };
              setOutcomes(copy);
            }}
            aria-label={`outcome-${idx}`}
          />
        ))}
        <Button variant="link" onClick={addOutcome}>
          Add outcome
        </Button>
      </ExpandableSection>

      <ExpandableSection toggleText="Tasks">
        {tasks.map((t, idx) => (
          <div key={idx} style={{ display: 'flex', gap: 8 }}>
            <TextInput
              value={t.name}
              onChange={(_, v) => {
                const copy = [...tasks];
                copy[idx] = { ...copy[idx], name: v };
                setTasks(copy);
              }}
              aria-label={`task-${idx}`}
            />
            <TextInput
              type="number"
              value={t.estimateHours || 0}
              onChange={(_, v) => {
                const copy = [...tasks];
                copy[idx] = { ...copy[idx], estimateHours: Number(v) };
                setTasks(copy);
              }}
              aria-label={`task-${idx}-hours`}
            />
          </div>
        ))}
        <Button variant="link" onClick={addTask}>
          Add task
        </Button>
      </ExpandableSection>

      <ExpandableSection toggleText="Risks">
        {risks.map((r, idx) => (
          <div key={idx} style={{ display: 'flex', gap: 8 }}>
            <TextInput
              value={r.name}
              onChange={(_, v) => {
                const copy = [...risks];
                copy[idx] = { ...copy[idx], name: v };
                setRisks(copy);
              }}
              aria-label={`risk-${idx}`}
            />
            <TextInput
              type="number"
              value={r.impactPercent || 0}
              onChange={(_, v) => {
                const copy = [...risks];
                copy[idx] = { ...copy[idx], impactPercent: Number(v) };
                setRisks(copy);
              }}
              aria-label={`risk-${idx}-impact`}
            />
          </div>
        ))}
        <Button variant="link" onClick={addRisk}>
          Add risk
        </Button>
      </ExpandableSection>

      <ExpandableSection toggleText="Out of scope">
        {outOfScope.map((o, idx) => (
          <TextInput
            key={idx}
            value={o.name}
            onChange={(_, v) => {
              const copy = [...outOfScope];
              copy[idx] = { ...copy[idx], name: v };
              setOutOfScope(copy);
            }}
            aria-label={`outofscope-${idx}`}
          />
        ))}
        <Button variant="link" onClick={addOut}>
          Add item
        </Button>
      </ExpandableSection>

      <ExpandableSection toggleText="Prerequisites">
        {prereqs.map((p, idx) => (
          <TextInput
            key={idx}
            value={p.name}
            onChange={(_, v) => {
              const copy = [...prereqs];
              copy[idx] = { ...copy[idx], name: v };
              setPrereqs(copy);
            }}
            aria-label={`prereq-${idx}`}
          />
        ))}
        <Button variant="link" onClick={addPrereq}>
          Add prereq
        </Button>
      </ExpandableSection>

      <ExpandableSection toggleText="Training">
        {training.map((p, idx) => (
          <TextInput
            key={idx}
            value={p.name}
            onChange={(_, v) => {
              const copy = [...training];
              copy[idx] = { ...copy[idx], name: v };
              setTraining(copy);
            }}
            aria-label={`training-${idx}`}
          />
        ))}
        <Button variant="link" onClick={addTraining}>
          Add training
        </Button>
      </ExpandableSection>

      <ExpandableSection toggleText="Team roles">
        {teamRoles.map((p, idx) => (
          <TextInput
            key={idx}
            value={p.role}
            onChange={(_, v) => {
              const copy = [...teamRoles];
              copy[idx] = { ...copy[idx], role: v };
              setTeamRoles(copy);
            }}
            aria-label={`teamrole-${idx}`}
          />
        ))}
        <Button variant="link" onClick={addRole}>
          Add role
        </Button>
      </ExpandableSection>

      <ExpandableSection toggleText="Team modeling">
        {teamModeling.map((p, idx) => (
          <div key={idx} style={{ display: 'flex', gap: 8 }}>
            <TextInput
              value={p.role}
              onChange={(_, v) => {
                const copy = [...teamModeling];
                copy[idx] = { ...copy[idx], role: v };
                setTeamModeling(copy);
              }}
              aria-label={`teammodel-role-${idx}`}
            />
            <TextInput
              value={p.task}
              onChange={(_, v) => {
                const copy = [...teamModeling];
                copy[idx] = { ...copy[idx], task: v };
                setTeamModeling(copy);
              }}
              aria-label={`teammodel-task-${idx}`}
            />
            <TextInput
              type="number"
              value={p.estimateHours || 0}
              onChange={(_, v) => {
                const copy = [...teamModeling];
                copy[idx] = { ...copy[idx], estimateHours: Number(v) };
                setTeamModeling(copy);
              }}
              aria-label={`teammodel-hours-${idx}`}
            />
          </div>
        ))}
        <Button variant="link" onClick={addModel}>
          Add team modeling
        </Button>
      </ExpandableSection>

      <Button type="submit" variant="primary">
        {submitLabel}
      </Button>
    </Form>
  );
};

export default TemplateForm;
