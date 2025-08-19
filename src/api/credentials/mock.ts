import { CredentialDto, SshKeyCreateRequest, SshKeyGenerateRequest, SshPublicKeyResponse } from './types';

let counter = 2;
const now = () => new Date().toISOString();

const seed: CredentialDto[] = [
  { 
    name: 'demo-key', 
    provider: 'github', 
    scope: 'user',
    secretRef: 'secret-ref-1',
    knownHostsRef: 'known-hosts-ref-1',
    passphraseRef: 'passphrase-ref-1',
    createdAt: now() 
  },
];

let keys: CredentialDto[] = [...seed];

const simulate = <T>(result: T, delay = 30): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(result), delay));

export const listSshKeys = async (userId: string): Promise<CredentialDto[]> => simulate([...keys]);

export const createSshKey = async (userId: string, req: SshKeyCreateRequest): Promise<void> => {
  const key: CredentialDto = { 
    name: req.name || `key-${counter++}`, 
    provider: req.provider,
    scope: 'user',
    secretRef: `secret-ref-${counter}`,
    knownHostsRef: `known-hosts-ref-${counter}`,
    passphraseRef: `passphrase-ref-${counter}`,
    createdAt: now() 
  };
  keys.push(key);
  await simulate(undefined);
};

export const generateSshKey = async (userId: string, req: SshKeyGenerateRequest): Promise<void> => {
  const key: CredentialDto = { 
    name: req.name, 
    provider: req.provider,
    scope: 'user',
    secretRef: `secret-ref-${counter}`,
    knownHostsRef: `known-hosts-ref-${counter}`,
    passphraseRef: `passphrase-ref-${counter}`,
    createdAt: now() 
  };
  keys.push(key);
  await simulate(undefined);
};

export const getPublicKey = async (userId: string, name: string): Promise<SshPublicKeyResponse> =>
  simulate({
    publicKey: `ssh-ed25519 AAAA... ${name}`,
    fingerprintSha256: 'MOCKFPR',
    name,
    provider: 'github',
  });

export const deleteSshKey = async (userId: string, name: string): Promise<void> => {
  keys = keys.filter((k) => k.name !== name);
  await simulate(undefined);
};

export const __reset = () => {
  keys = [...seed];
  counter = seed.length + 1;
};
