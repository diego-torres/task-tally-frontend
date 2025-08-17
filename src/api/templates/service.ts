import {
  CreateTemplateRequest,
  TemplateDto,
  UpdateTemplateRequest,
} from './types';
import * as mock from './mock';

// Base URL for future backend integration
const BASE = process.env.REACT_APP_API_BASE_URL || '/api';

// TODO: replace mock calls with real fetch requests
export const listTemplates = (): Promise<{ items: TemplateDto[] }> =>
  mock.listTemplates();

export const getTemplate = (id: string): Promise<TemplateDto> =>
  mock.getTemplate(id);

export const createTemplate = (
  req: CreateTemplateRequest,
): Promise<TemplateDto> => mock.createTemplate(req);

export const updateTemplate = (
  id: string,
  req: UpdateTemplateRequest,
): Promise<TemplateDto> => mock.updateTemplate(id, req);

export const deleteTemplate = (id: string): Promise<void> =>
  mock.deleteTemplate(id);

export const __BASE_URL = BASE; // exported for potential external use
