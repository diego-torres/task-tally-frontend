export interface CredentialDto {
  name: string;
  provider: string;
  scope: string;
  secretRef: string;
  knownHostsRef: string;
  passphraseRef: string;
  createdAt: string;
}

export interface SshKeyCreateRequest {
  name: string;
  provider: string;
  privateKeyPem: string;
  knownHosts?: string;
  passphrase?: string;
  hostname?: string;
}

export interface SshKeyGenerateRequest {
  name: string;
  provider: string;
  comment?: string;
  knownHosts?: string;
  passphrase?: string;
  hostname?: string;
}

export interface SshPublicKeyResponse {
  publicKey: string;
  fingerprintSha256: string;
  name: string;
  provider: string;
}
