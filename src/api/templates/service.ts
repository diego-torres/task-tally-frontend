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
      try {
        const res = await apiFetch(`${BASE}/api/users/${userId}/templates`);
        if (!res.ok) {
          if (res.status === 401) {
            throw new Error('Authentication required. Please log in again.');
          } else if (res.status === 403) {
            throw new Error('You do not have permission to access templates.');
          } else if (res.status >= 500) {
            throw new Error('Server error. Please try again later.');
          } else {
            throw new Error(`Failed to fetch templates (${res.status})`);
          }
        }
        return res.json();
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error('Failed to fetch templates');
      }
    };

    const getTemplate = async (userId: string, id: number): Promise<TemplateDto> => {
      // Note: The OpenAPI spec doesn't show a GET endpoint for individual templates
      // This might need to be implemented on the backend or we can filter from the list
      try {
        const templates = await listTemplates(userId);
        const template = templates.find(t => t.id === id);
        if (!template) {
          throw new Error(`Template with id ${id} not found`);
        }
        return template;
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error(`Failed to get template ${id}`);
      }
    };

    const createTemplate = async (userId: string, req: CreateTemplateRequest): Promise<TemplateDto> => {
      try {
        const res = await apiFetch(`${BASE}/api/users/${userId}/templates`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(req),
        });
        if (!res.ok) {
          if (res.status === 401) {
            throw new Error('Authentication required. Please log in again.');
          } else if (res.status === 403) {
            throw new Error('You do not have permission to create templates.');
          } else if (res.status === 400) {
            throw new Error('Invalid template data. Please check your input.');
          } else if (res.status >= 500) {
            throw new Error('Server error. Please try again later.');
          } else {
            throw new Error(`Failed to create template (${res.status})`);
          }
        }
        return res.json();
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error('Failed to create template');
      }
    };

    const updateTemplate = async (userId: string, id: number, req: UpdateTemplateRequest): Promise<TemplateDto> => {
      try {
        const res = await apiFetch(`${BASE}/api/users/${userId}/templates/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(req),
        });
        if (!res.ok) {
          if (res.status === 401) {
            throw new Error('Authentication required. Please log in again.');
          } else if (res.status === 403) {
            throw new Error('You do not have permission to update this template.');
          } else if (res.status === 404) {
            throw new Error(`Template with id ${id} not found`);
          } else if (res.status === 400) {
            throw new Error('Invalid template data. Please check your input.');
          } else if (res.status >= 500) {
            throw new Error('Server error. Please try again later.');
          } else {
            throw new Error(`Failed to update template (${res.status})`);
          }
        }
        return res.json();
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error('Failed to update template');
      }
    };

    const deleteTemplate = async (userId: string, id: number): Promise<void> => {
      try {
        const res = await apiFetch(`${BASE}/api/users/${userId}/templates/${id}`, {
          method: 'DELETE',
        });
        if (!res.ok) {
          if (res.status === 401) {
            throw new Error('Authentication required. Please log in again.');
          } else if (res.status === 403) {
            throw new Error('You do not have permission to delete this template.');
          } else if (res.status === 404) {
            throw new Error(`Template with id ${id} not found`);
          } else if (res.status >= 500) {
            throw new Error('Server error. Please try again later.');
          } else {
            throw new Error(`Failed to delete template (${res.status})`);
          }
        }
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error('Failed to delete template');
      }
    };

    const validateGitSsh = async (req: ValidateRequest): Promise<void> => {
      try {
        const res = await apiFetch(`${BASE}/git/ssh/validate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(req),
        });
        if (!res.ok) {
          if (res.status === 401) {
            throw new Error('Authentication required. Please log in again.');
          } else if (res.status === 400) {
            throw new Error('Invalid SSH configuration. Please check your settings.');
          } else if (res.status >= 500) {
            throw new Error('Server error. Please try again later.');
          } else {
            throw new Error(`Failed to validate Git SSH connection (${res.status})`);
          }
        }
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }
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
