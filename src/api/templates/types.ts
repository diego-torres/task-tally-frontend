export type Provider = 'github' | 'gitlab';

export interface TemplateDto {
  id: string;
  name: string;
  description?: string;
  provider: Provider;
  sshRepoUri: string;
  defaultBranch: string;
  credentialName?: string;
  updatedAt?: string;
  version?: number;
  files?: FilesPayload;
}

export interface FilesPayload {
  template: { technologies?: string[]; description?: string };
  outcomes?: any[];
  tasks?: any[];
  risks?: any[];
  outOfScope?: any[];
  prereqs?: any[];
  training?: any[];
  teamRoles?: any[];
  teamModeling?: any;
}

export interface CreateTemplateRequest {
  name: string;
  description?: string;
  provider: Provider;
  sshRepoUri: string;
  defaultBranch: string;
  credentialName?: string;
  files?: FilesPayload;
}

export type UpdateTemplateRequest = CreateTemplateRequest;
