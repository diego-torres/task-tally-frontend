export interface CredentialDto {
  name?: string;
  provider?: string;
  fingerprint?: string;
  createdAt?: string;
}

export interface SshKeyCreateRequest {
  name?: string;
  provider?: string;
  privateKeyPem?: string;
  knownHosts?: string;
  passphrase?: string;
}

export interface SshKeyGenerateRequest {
  name: string;
  provider: 'github' | 'gitlab';
  comment?: string;
  knownHosts?: string;
  passphrase?: string;
}

export interface SshPublicKeyResponse {
  publicKey: string;
  fingerprintSha256: string;
  name: string;
  provider: string;
}
