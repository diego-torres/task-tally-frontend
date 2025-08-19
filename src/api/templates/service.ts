import { CreateTemplateRequest, TemplateDto, UpdateTemplateRequest, ValidateRequest } from './types';
import { useApiFetch } from '@app/utils/api';
import * as React from 'react';
import * as mock from './mock';

const BASE = process.env.TASK_TALLY_BACKEND || '/api';

// Hook to use template service inside React components
export function useTemplateService() {
  const apiFetch = useApiFetch();

  const service = React.useMemo(() => {
    const listTemplates = async (userId: string): Promise<TemplateDto[]> => {
      const res = await apiFetch(`${BASE}/users/${userId}/templates`);
      if (!res.ok) {
        throw new Error('Failed to fetch templates');
      }
      return res.json();
    };

    const getTemplate = async (userId: string, id: number): Promise<TemplateDto> => {
      // Note: The OpenAPI spec doesn't show a GET endpoint for individual templates
      // This might need to be implemented on the backend or we can filter from the list
      const templates = await listTemplates(userId);
      const template = templates.find(t => t.id === id);
      if (!template) {
        throw new Error(`Template with id ${id} not found`);
      }
      return template;
    };

    const createTemplate = async (userId: string, req: CreateTemplateRequest): Promise<TemplateDto> => {
      const res = await apiFetch(`${BASE}/users/${userId}/templates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req),
      });
      if (!res.ok) {
        throw new Error('Failed to create template');
      }
      return res.json();
    };

    const updateTemplate = async (userId: string, id: number, req: UpdateTemplateRequest): Promise<TemplateDto> => {
      const res = await apiFetch(`${BASE}/users/${userId}/templates/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req),
      });
      if (!res.ok) {
        throw new Error('Failed to update template');
      }
      return res.json();
    };

    const deleteTemplate = async (userId: string, id: number): Promise<void> => {
      const res = await apiFetch(`${BASE}/users/${userId}/templates/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        throw new Error('Failed to delete template');
      }
    };

    const validateGitSsh = async (req: ValidateRequest): Promise<void> => {
      const res = await apiFetch(`${BASE}/git/ssh/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req),
      });
      if (!res.ok) {
        throw new Error('Failed to validate Git SSH connection');
      }
    };

    return {
      listTemplates,
      getTemplate,
      createTemplate,
      updateTemplate,
      deleteTemplate,
      validateGitSsh,
    };
  }, [apiFetch]);

  return service;
}

// Mock service for testing
export function useMockTemplateService() {
  const service = React.useMemo(() => {
    const listTemplates = async (userId: string): Promise<TemplateDto[]> => {
      return mock.listTemplates(userId);
    };

    const getTemplate = async (userId: string, id: number): Promise<TemplateDto> => {
      return mock.getTemplate(userId, id);
    };

    const createTemplate = async (userId: string, req: CreateTemplateRequest): Promise<TemplateDto> => {
      return mock.createTemplate(userId, req);
    };

    const updateTemplate = async (userId: string, id: number, req: UpdateTemplateRequest): Promise<TemplateDto> => {
      return mock.updateTemplate(userId, id, req);
    };

    const deleteTemplate = async (userId: string, id: number): Promise<void> => {
      return mock.deleteTemplate(userId, id);
    };

    const validateGitSsh = async (req: ValidateRequest): Promise<void> => {
      // Mock validation always succeeds
      return Promise.resolve();
    };

    return {
      listTemplates,
      getTemplate,
      createTemplate,
      updateTemplate,
      deleteTemplate,
      validateGitSsh,
    };
  }, []);

  return service;
}

export const __BASE_URL = BASE;
