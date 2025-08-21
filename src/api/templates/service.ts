import { CreateTemplateRequest, TemplateDto, UpdateTemplateRequest, ValidateRequest, OutcomeDto } from './types';
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

    // Outcomes API methods
    const listOutcomes = async (userId: string, templateId: number): Promise<OutcomeDto[]> => {
      try {
        const res = await apiFetch(`${BASE}/api/users/${userId}/templates/${templateId}/outcomes`);
        if (!res.ok) {
          if (res.status === 401) {
            throw new Error('Authentication required. Please log in again.');
          } else if (res.status === 403) {
            throw new Error('You do not have permission to access outcomes.');
          } else if (res.status >= 500) {
            throw new Error('Server error. Please try again later.');
          } else {
            throw new Error(`Failed to fetch outcomes (${res.status})`);
          }
        }
        return res.json();
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error('Failed to fetch outcomes');
      }
    };

    const createOutcome = async (userId: string, templateId: number, outcome: OutcomeDto): Promise<OutcomeDto> => {
      try {
        const res = await apiFetch(`${BASE}/api/users/${userId}/templates/${templateId}/outcomes`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(outcome),
        });
        if (!res.ok) {
          if (res.status === 401) {
            throw new Error('Authentication required. Please log in again.');
          } else if (res.status === 403) {
            throw new Error('You do not have permission to create outcomes.');
          } else if (res.status === 400) {
            throw new Error('Invalid outcome data. Please check your input.');
          } else if (res.status >= 500) {
            throw new Error('Server error. Please try again later.');
          } else {
            throw new Error(`Failed to create outcome (${res.status})`);
          }
        }
        return res.json();
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error('Failed to create outcome');
      }
    };

    const updateOutcome = async (userId: string, templateId: number, outcomeId: number, outcome: OutcomeDto): Promise<OutcomeDto> => {
      try {
        const res = await apiFetch(`${BASE}/api/users/${userId}/templates/${templateId}/outcomes/${outcomeId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(outcome),
        });
        if (!res.ok) {
          if (res.status === 401) {
            throw new Error('Authentication required. Please log in again.');
          } else if (res.status === 403) {
            throw new Error('You do not have permission to update this outcome.');
          } else if (res.status === 404) {
            throw new Error(`Outcome with id ${outcomeId} not found`);
          } else if (res.status === 400) {
            throw new Error('Invalid outcome data. Please check your input.');
          } else if (res.status >= 500) {
            throw new Error('Server error. Please try again later.');
          } else {
            throw new Error(`Failed to update outcome (${res.status})`);
          }
        }
        return res.json();
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error('Failed to update outcome');
      }
    };

    const deleteOutcome = async (userId: string, templateId: number, outcomeId: number): Promise<void> => {
      try {
        const res = await apiFetch(`${BASE}/api/users/${userId}/templates/${templateId}/outcomes/${outcomeId}`, {
          method: 'DELETE',
        });
        if (!res.ok) {
          if (res.status === 401) {
            throw new Error('Authentication required. Please log in again.');
          } else if (res.status === 403) {
            throw new Error('You do not have permission to delete this outcome.');
          } else if (res.status === 404) {
            throw new Error(`Outcome with id ${outcomeId} not found`);
          } else if (res.status >= 500) {
            throw new Error('Server error. Please try again later.');
          } else {
            throw new Error(`Failed to delete outcome (${res.status})`);
          }
        }
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error('Failed to delete outcome');
      }
    };

    const deleteAllOutcomes = async (userId: string, templateId: number): Promise<void> => {
      try {
        const res = await apiFetch(`${BASE}/api/users/${userId}/templates/${templateId}/outcomes`, {
          method: 'DELETE',
        });
        if (!res.ok) {
          if (res.status === 401) {
            throw new Error('Authentication required. Please log in again.');
          } else if (res.status === 403) {
            throw new Error('You do not have permission to delete outcomes.');
          } else if (res.status >= 500) {
            throw new Error('Server error. Please try again later.');
          } else {
            throw new Error(`Failed to delete all outcomes (${res.status})`);
          }
        }
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error('Failed to delete all outcomes');
      }
    };

    return {
      listTemplates,
      getTemplate,
      createTemplate,
      updateTemplate,
      deleteTemplate,
      validateGitSsh,
      listOutcomes,
      createOutcome,
      updateOutcome,
      deleteOutcome,
      deleteAllOutcomes,
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

    // Outcomes API methods
    const listOutcomes = async (userId: string, templateId: number): Promise<OutcomeDto[]> => {
      return mock.listOutcomes(userId, templateId);
    };

    const createOutcome = async (userId: string, templateId: number, outcome: OutcomeDto): Promise<OutcomeDto> => {
      return mock.createOutcome(userId, templateId, outcome);
    };

    const updateOutcome = async (userId: string, templateId: number, outcomeId: number, outcome: OutcomeDto): Promise<OutcomeDto> => {
      return mock.updateOutcome(userId, templateId, outcomeId, outcome);
    };

    const deleteOutcome = async (userId: string, templateId: number, outcomeId: number): Promise<void> => {
      return mock.deleteOutcome(userId, templateId, outcomeId);
    };

    const deleteAllOutcomes = async (userId: string, templateId: number): Promise<void> => {
      return mock.deleteAllOutcomes(userId, templateId);
    };

    return {
      listTemplates,
      getTemplate,
      createTemplate,
      updateTemplate,
      deleteTemplate,
      validateGitSsh,
      listOutcomes,
      createOutcome,
      updateOutcome,
      deleteOutcome,
      deleteAllOutcomes,
    };
  }, []);

  return service;
}

export const __BASE_URL = BASE;
