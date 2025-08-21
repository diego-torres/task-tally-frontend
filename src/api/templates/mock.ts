import { CreateTemplateRequest, TemplateDto, UpdateTemplateRequest, OutcomeDto } from './types';

let counter = 3;
let outcomeCounter = 1;

const seed: TemplateDto[] = [
  {
    id: 1,
    name: 'Starter Template',
    description: 'Seed repository',
    provider: 'github',
    repositoryUrl: 'git@github.com:example/starter.git',
    defaultBranch: 'main',
    sshKeyName: 'github-key',
  },
  {
    id: 2,
    name: 'Backend Template',
    description: 'Quarkus backend',
    provider: 'gitlab',
    repositoryUrl: 'git@gitlab.com:example/backend.git',
    defaultBranch: 'main',
    sshKeyName: 'gitlab-key',
  },
];

let templates: TemplateDto[] = [...seed];

const simulate = <T>(result: T, delay = 30): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(result), delay));

export const listTemplates = async (userId: string): Promise<TemplateDto[]> => simulate([...templates]);

export const getTemplate = async (userId: string, id: number): Promise<TemplateDto> => {
  const t = templates.find((tpl) => tpl.id === id);
  if (!t) {
    throw new Error('Template not found');
  }
  return simulate({ ...t });
};

export const createTemplate = async (userId: string, req: CreateTemplateRequest): Promise<TemplateDto> => {
  if (templates.some((t) => t.repositoryUrl === req.repositoryUrl)) {
    throw new Error('Template for repository already exists');
  }
  const tpl: TemplateDto = {
    id: counter++,
    ...req,
  };
  templates.push(tpl);
  return simulate({ ...tpl });
};

export const updateTemplate = async (userId: string, id: number, req: UpdateTemplateRequest): Promise<TemplateDto> => {
  const idx = templates.findIndex((t) => t.id === id);
  if (idx === -1) {
    throw new Error('Template not found');
  }
  templates[idx] = { ...templates[idx], ...req };
  return simulate({ ...templates[idx] });
};

export const deleteTemplate = async (userId: string, id: number): Promise<void> => {
  templates = templates.filter((t) => t.id !== id);
  await simulate(undefined);
};

// Outcomes mock data
const outcomes: Map<number, OutcomeDto[]> = new Map();

export const listOutcomes = async (userId: string, templateId: number): Promise<OutcomeDto[]> => {
  const templateOutcomes = outcomes.get(templateId) || [];
  return simulate([...templateOutcomes]);
};

export const createOutcome = async (userId: string, templateId: number, outcome: OutcomeDto): Promise<OutcomeDto> => {
  const newOutcome: OutcomeDto = {
    ...outcome,
    id: outcomeCounter++,
  };
  
  const templateOutcomes = outcomes.get(templateId) || [];
  templateOutcomes.push(newOutcome);
  outcomes.set(templateId, templateOutcomes);
  
  return simulate({ ...newOutcome });
};

export const updateOutcome = async (userId: string, templateId: number, outcomeId: number, outcome: OutcomeDto): Promise<OutcomeDto> => {
  const templateOutcomes = outcomes.get(templateId) || [];
  const index = templateOutcomes.findIndex(o => o.id === outcomeId);
  
  if (index === -1) {
    throw new Error('Outcome not found');
  }
  
  const updatedOutcome: OutcomeDto = {
    ...outcome,
    id: outcomeId,
  };
  
  templateOutcomes[index] = updatedOutcome;
  outcomes.set(templateId, templateOutcomes);
  
  return simulate({ ...updatedOutcome });
};

export const deleteOutcome = async (userId: string, templateId: number, outcomeId: number): Promise<void> => {
  const templateOutcomes = outcomes.get(templateId) || [];
  const filteredOutcomes = templateOutcomes.filter(o => o.id !== outcomeId);
  outcomes.set(templateId, filteredOutcomes);
  
  await simulate(undefined);
};

export const deleteAllOutcomes = async (userId: string, templateId: number): Promise<void> => {
  outcomes.delete(templateId);
  await simulate(undefined);
};

export const __reset = () => {
  templates = [...seed];
  counter = seed.length + 1;
  outcomes.clear();
  outcomeCounter = 1;
};
