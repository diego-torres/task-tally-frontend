import { CredentialDto, SshKeyCreateRequest } from './types';
import { useApiFetch } from '@app/utils/api';

const BASE = process.env.TASK_TALLY_BACKEND || '/api';


// Hook to use credential service inside React components
export function useCredentialService() {
  const apiFetch = useApiFetch();

  const listSshKeys = async (userId: string): Promise<CredentialDto[]> => {
    const res = await apiFetch(`${BASE}/api/users/${userId}/ssh-keys`);
    if (!res.ok) {
      throw new Error('Failed to fetch SSH keys');
    }
    return res.json();
  };

  const createSshKey = async (userId: string, req: SshKeyCreateRequest): Promise<void> => {
    const res = await apiFetch(`${BASE}/api/users/${userId}/ssh-keys`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });
    if (!res.ok) {
      throw new Error('Failed to create SSH key');
    }
  };

  const deleteSshKey = async (userId: string, name: string): Promise<void> => {
    const res = await apiFetch(`${BASE}/api/users/${userId}/ssh-keys/${encodeURIComponent(name)}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      throw new Error('Failed to delete SSH key');
    }
  };

  return { listSshKeys, createSshKey, deleteSshKey };
}

export const __BASE_URL = BASE;
