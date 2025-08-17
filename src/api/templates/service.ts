import { CreateTemplateRequest, TemplateDto, UpdateTemplateRequest } from './types';
import * as mock from './mock';

// Base URL for future backend integration
const BASE = process.env.REACT_APP_API_BASE_URL || '/api';

// TODO: switch to real fetch using baseUrl + OpenAPI paths
export const listTemplates = (userId: string): Promise<TemplateDto[]> => mock.listTemplates(userId);

export const getTemplate = (userId: string, id: string): Promise<TemplateDto> => mock.getTemplate(userId, id);

export const createTemplate = (userId: string, req: CreateTemplateRequest): Promise<TemplateDto> =>
  mock.createTemplate(userId, req);

export const updateTemplate = (userId: string, id: string, req: UpdateTemplateRequest): Promise<TemplateDto> =>
  mock.updateTemplate(userId, id, req);

export const deleteTemplate = (userId: string, id: string): Promise<void> => mock.deleteTemplate(userId, id);

export const __BASE_URL = BASE;
