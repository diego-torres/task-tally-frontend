import { CreateTemplateRequest, TemplateDto, UpdateTemplateRequest } from './types';

let counter = 3;
const now = () => new Date().toISOString();

const seed: TemplateDto[] = [
  {
    id: '1',
    name: 'Starter Template',
    description: 'Seed repository',
    provider: 'github',
    sshRepoUri: 'git@github.com:example/starter.git',
    defaultBranch: 'main',
    updatedAt: now(),
    version: 1,
  },
  {
    id: '2',
    name: 'Backend Template',
    description: 'Quarkus backend',
    provider: 'gitlab',
    sshRepoUri: 'git@gitlab.com:example/backend.git',
    defaultBranch: 'main',
    updatedAt: now(),
    version: 1,
  },
];

let templates: TemplateDto[] = [...seed];

const simulate = <T>(result: T, delay = 30): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(result), delay));

export const listTemplates = async (userId: string): Promise<TemplateDto[]> => simulate([...templates]);

export const getTemplate = async (userId: string, id: string): Promise<TemplateDto> => {
  const t = templates.find((tpl) => tpl.id === id);
  if (!t) {
    throw new Error('Template not found');
  }
  return simulate({ ...t });
};

export const createTemplate = async (userId: string, req: CreateTemplateRequest): Promise<TemplateDto> => {
  if (templates.some((t) => t.sshRepoUri === req.sshRepoUri)) {
    throw new Error('Template for repository already exists');
  }
  const tpl: TemplateDto = {
    id: String(counter++),
    updatedAt: now(),
    version: 1,
    ...req,
  };
  templates.push(tpl);
  return simulate({ ...tpl });
};

export const updateTemplate = async (userId: string, id: string, req: UpdateTemplateRequest): Promise<TemplateDto> => {
  const idx = templates.findIndex((t) => t.id === id);
  if (idx === -1) {
    throw new Error('Template not found');
  }
  templates[idx] = { ...templates[idx], ...req, updatedAt: now() };
  return simulate({ ...templates[idx] });
};

export const deleteTemplate = async (userId: string, id: string): Promise<void> => {
  templates = templates.filter((t) => t.id !== id);
  await simulate(undefined);
};

export const __reset = () => {
  templates = [...seed];
  counter = seed.length + 1;
};
