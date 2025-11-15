// Common value objects and types
export type UUID = string;
export type Timestamp = Date;
export type URL = string;

// Status enums
export enum AnalysisStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export enum RebuildStatus {
  PENDING = 'pending',
  GENERATED = 'generated',
  PREVIEW_READY = 'preview_ready',
  FAILED = 'failed',
}

export enum DeploymentStatus {
  QUEUED = 'queued',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  ROLLED_BACK = 'rolled_back',
}

export enum RestaurantStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING_SETUP = 'pending_setup',
  SUSPENDED = 'suspended',
}

export enum ClientStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  CHURNED = 'churned',
}

export enum ServiceTier {
  SELF_SERVE = 'self_serve',
  AGENCY_BASIC = 'agency_basic',
  AGENCY_PRO = 'agency_pro',
  ENTERPRISE = 'enterprise',
}

// Base interfaces
export interface Entity {
  id: UUID;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface AggregateRoot extends Entity {
  version: number;
}
