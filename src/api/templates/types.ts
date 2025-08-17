/**
 * Template related types derived from the backend OpenAPI spec.
 * TODO: align with OpenAPI when spec stabilizes.
 */

export interface TemplateDto {
  id: string;
  name: string;
  description?: string;
  provider: 'github' | 'gitlab';
  sshRepoUri: string;
  defaultBranch: string;
  credentialName: string;
  updatedAt: string; // ISO timestamp
  version: number;
  files?: FilesPayload;
}

export interface CreateTemplateRequest {
  name: string;
  description?: string;
  provider: 'github' | 'gitlab';
  sshRepoUri: string;
  defaultBranch: string;
  credentialName: string;
  files: FilesPayload;
}

export type UpdateTemplateRequest = CreateTemplateRequest;

export interface FilesPayload {
  template: TemplateFile;
  outcomes?: Outcome[];
  tasks?: Task[];
  risks?: Risk[];
  outOfScope?: OutOfScopeItem[];
  prereqs?: PrereqItem[];
  training?: TrainingItem[];
  teamRoles?: TeamRole[];
  teamModeling?: TeamModelingItem[];
}

export interface TemplateFile {
  name: string;
  description?: string;
  technologies?: string[];
}

export interface Outcome {
  name: string;
  description?: string;
}

export interface Task {
  name: string;
  estimateHours?: number;
}

export interface Risk {
  name: string;
  impactPercent?: number; // 0-100
  mitigation?: string;
}

export interface OutOfScopeItem {
  name: string;
}

export interface PrereqItem {
  name: string;
}

export interface TrainingItem {
  name: string;
}

export interface TeamRole {
  role: string;
  description?: string;
}

export interface TeamModelingItem {
  role: string;
  task: string;
  estimateHours?: number;
}
