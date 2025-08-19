import { CreateTemplateRequest, TemplateDto, UpdateTemplateRequest } from './types';

let counter = 3;

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

export const __reset = () => {
  templates = [...seed];
  counter = seed.length + 1;
};
