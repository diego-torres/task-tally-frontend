export type Provider = 'github' | 'gitlab';

export interface TemplateDto {
  id: number;
  name: string;
  description?: string;
  repositoryUrl: string;
  provider: Provider;
  defaultBranch: string;
  sshKeyName?: string;
}

export interface CreateTemplateRequest {
  name: string;
  description?: string;
  repositoryUrl: string;
  provider: Provider;
  defaultBranch: string;
  sshKeyName?: string;
}

export type UpdateTemplateRequest = CreateTemplateRequest;

export interface ValidateRequest {
  provider: string;
  owner: string;
  repo: string;
  branch: string;
  credentialName: string;
}
