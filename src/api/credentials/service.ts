
import * as React from 'react';
import {
  CredentialDto,
  SshKeyCreateRequest,
  SshKeyGenerateRequest,
  SshPublicKeyResponse,
} from './types';
import { useApiFetch } from '@app/utils/api';

const BASE = process.env.TASK_TALLY_BACKEND || '/api';


// Hook to use credential service inside React components
export function useCredentialService() {
  const apiFetch = useApiFetch();

  const service = React.useMemo(() => {
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

    const generateSshKey = async (userId: string, req: SshKeyGenerateRequest): Promise<void> => {
      const res = await apiFetch(`${BASE}/api/users/${userId}/ssh-keys/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req),
      });
      if (!res.ok) {
        throw new Error('Failed to generate SSH key');
      }
    };

    const getPublicKey = async (userId: string, name: string): Promise<SshPublicKeyResponse> => {
      const res = await apiFetch(`${BASE}/api/users/${userId}/ssh-keys/${encodeURIComponent(name)}/public`);
      if (!res.ok) {
        const errorMessage = res.status === 404 
          ? `SSH key "${name}" not found` 
          : res.status === 403 
          ? 'Access denied to SSH key'
          : `Failed to fetch public key (${res.status})`;
        throw new Error(errorMessage);
      }
      return res.json();
    };

    const downloadPublicKeyAsFile = async (userId: string, name: string): Promise<void> => {
      try {
        const { publicKey } = await getPublicKey(userId, name);
        const blob = new Blob([publicKey.endsWith('\n') ? publicKey : publicKey + '\n'], {
          type: 'text/plain;charset=utf-8',
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${name}.pub`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      } catch (error) {
        // Re-throw the error with a more user-friendly message
        if (error instanceof Error) {
          throw new Error(`Failed to download public key: ${error.message}`);
        }
        throw new Error('Failed to download public key');
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

    return {
      listSshKeys,
      createSshKey,
      deleteSshKey,
      generateSshKey,
      getPublicKey,
      downloadPublicKeyAsFile,
    };
  }, [apiFetch]);

  return service;
}

export const __BASE_URL = BASE;
