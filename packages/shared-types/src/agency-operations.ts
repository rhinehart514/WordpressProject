import { UUID, Timestamp, ClientStatus, ServiceTier, Entity, AggregateRoot } from './common';

// Agency Client
export interface AgencyClient extends Entity {
  restaurantId: UUID;
  serviceTier: ServiceTier;
  status: ClientStatus;
  lastUpdated?: Timestamp;
  assignedAgentId?: UUID;
  monthlyUpdateCount: number;
  notes?: string;
}

// Health Check Result
export interface HealthCheckResult {
  timestamp: Timestamp;
  siteAccessible: boolean;
  menuUpToDate: boolean;
  hoursAccurate: boolean;
  imagesLoading: boolean;
  issues: string[];
  overallScore: number; // 0-100
}

// Maintenance Schedule
export interface MaintenanceSchedule extends Entity {
  clientId: UUID;
  frequency: 'weekly' | 'biweekly' | 'monthly';
  nextScheduledDate: Timestamp;
  autoUpdateEnabled: boolean;
  updateTypes: Array<'menu' | 'hours' | 'gallery' | 'content'>;
}

// Bulk Operation
export interface BulkOperation extends AggregateRoot {
  operationType: 'menu_update' | 'hours_update' | 'gallery_update' | 'site_rebuild';
  targetClientIds: UUID[];
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  progress: number; // 0-100
  completedCount: number;
  failedCount: number;
  errors?: Array<{
    clientId: UUID;
    error: string;
  }>;
  initiatedByUserId: UUID;
}

// Client Portfolio (Aggregate Root)
export interface ClientPortfolio extends AggregateRoot {
  agencyUserId: UUID;
  clients: AgencyClient[];
  activeClientCount: number;
  totalRevenueCents: number;
}

// DTOs
export interface CreateClientDto {
  restaurantId: UUID;
  serviceTier: ServiceTier;
  assignedAgentId?: UUID;
}

export interface UpdateClientDto {
  serviceTier?: ServiceTier;
  status?: ClientStatus;
  assignedAgentId?: UUID;
  notes?: string;
}

export interface ScheduleMaintenanceDto {
  clientId: UUID;
  frequency: 'weekly' | 'biweekly' | 'monthly';
  updateTypes: Array<'menu' | 'hours' | 'gallery' | 'content'>;
  autoUpdateEnabled: boolean;
}

export interface StartBulkOperationDto {
  operationType: 'menu_update' | 'hours_update' | 'gallery_update' | 'site_rebuild';
  targetClientIds: UUID[];
  payload: any; // Operation-specific data
}

export interface ClientDashboardDto {
  client: AgencyClient;
  latestHealthCheck?: HealthCheckResult;
  upcomingMaintenance?: Timestamp;
  recentUpdates: Array<{
    type: string;
    timestamp: Timestamp;
    description: string;
  }>;
}

export interface AgencyAnalyticsDto {
  totalClients: number;
  activeClients: number;
  totalRevenueCents: number;
  updatesByTier: Record<ServiceTier, number>;
  healthScoreAverage: number;
  clientsByStatus: Record<ClientStatus, number>;
}
