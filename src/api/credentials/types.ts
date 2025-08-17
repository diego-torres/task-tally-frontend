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
