export type Provider = 'github' | 'gitlab';

// Base item interface for common fields
export interface BaseItem {
  phase: string;
  track: string;
  product?: string;
  environment?: string;
  prefix?: string;
  scopingNotes?: string;
}

// Outcomes
export interface Outcome extends BaseItem {
  outcomeText: string;
}

// Tasks
export interface Task extends BaseItem {
  taskDescription: string;
  hoursBestCase: number;
  hoursWorstCase: number;
  hoursMostLikely: number;
  deliveryGuidance?: string;
}

// Risks
export interface Risk extends BaseItem {
  risk: string;
  chanceOfOccurring: number; // percentage
  impactHoursBestCase: number;
  impactHoursWorstCase: number;
  impactHoursMostLikely: number;
}

// Out of Scope
export interface OutOfScope extends BaseItem {
  taskDescription: string;
}

// Prerequisites
export interface Prerequisite extends BaseItem {
  assumption: string;
}

// Training
export interface Training extends BaseItem {
  clientRole: string;
  courseName: string;
  courseDescription: string;
}

// Team Roles
export interface TeamRole {
  role: string;
  minimumTitle: string;
  laborCategory: string;
  allowPartialWeeks: boolean;
  billablePercentage: number; // percentage focused on scoped tasks
  subcontractorPermitted: boolean;
  primarySkill: string;
  primarySkillLevel: string;
  optionalSkill1?: string;
  optionalSkill1Level?: string;
  optionalSkill2?: string;
  optionalSkill2Level?: string;
  optionalSkill3?: string;
  optionalSkill3Level?: string;
  optionalSkill4?: string;
  optionalSkill4Level?: string;
  workLocation: string;
  clientSystemKeyboardAccessType: string;
  clearanceRequirements?: string;
  otherNotes?: string;
}

// Team Modeling
export interface TeamModeling {
  role: string;
  phase: string;
  track: string;
  percentage: number;
}

export interface TemplateDto {
  id: number;
  name: string;
  description?: string;
  repositoryUrl: string;
  provider: Provider;
  defaultBranch: string;
  sshKeyName?: string;
  // New fields for template details
  outcomes?: Outcome[];
  tasks?: Task[];
  risks?: Risk[];
  outOfScope?: OutOfScope[];
  prerequisites?: Prerequisite[];
  training?: Training[];
  teamRoles?: TeamRole[];
  teamModeling?: TeamModeling[];
}

export interface CreateTemplateRequest {
  name: string;
  description?: string;
  repositoryUrl: string;
  provider: Provider;
  defaultBranch: string;
  sshKeyName?: string;
  // New fields for template details
  outcomes?: Outcome[];
  tasks?: Task[];
  risks?: Risk[];
  outOfScope?: OutOfScope[];
  prerequisites?: Prerequisite[];
  training?: Training[];
  teamRoles?: TeamRole[];
  teamModeling?: TeamModeling[];
}

export type UpdateTemplateRequest = CreateTemplateRequest;

export interface ValidateRequest {
  provider: string;
  owner: string;
  repo: string;
  branch: string;
  credentialName: string;
}
