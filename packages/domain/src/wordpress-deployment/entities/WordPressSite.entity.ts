import { Entity } from '../../base/Entity';
import { WordPressEndpoint } from '../value-objects/WordPressEndpoint';

export interface WordPressSiteMetadata {
  siteName?: string;
  adminEmail?: string;
  wpVersion?: string;
  bricksVersion?: string;
  themeActive?: string;
}

export type HealthStatus = 'healthy' | 'warning' | 'error';

export interface WordPressSiteData {
  restaurantId: string;
  baseUrl: string;
  apiKey: string;
  siteMetadata?: WordPressSiteMetadata;
}

export class WordPressSite extends Entity<WordPressSiteData> {
  private restaurantId: string;
  private endpoint: WordPressEndpoint;
  private siteMetadata: WordPressSiteMetadata;
  private lastHealthCheck?: Date;
  private healthStatus?: HealthStatus;

  constructor(data: WordPressSiteData, id?: string) {
    super(id);
    this.restaurantId = data.restaurantId;
    this.endpoint = new WordPressEndpoint(data.baseUrl, data.apiKey);
    this.siteMetadata = data.siteMetadata || {};
  }

  public getRestaurantId(): string {
    return this.restaurantId;
  }

  public getEndpoint(): WordPressEndpoint {
    return this.endpoint;
  }

  public getBaseUrl(): string {
    return this.endpoint.getBaseUrl();
  }

  public getSiteMetadata(): WordPressSiteMetadata {
    return { ...this.siteMetadata };
  }

  public getLastHealthCheck(): Date | undefined {
    return this.lastHealthCheck;
  }

  public getHealthStatus(): HealthStatus | undefined {
    return this.healthStatus;
  }

  public updateMetadata(metadata: Partial<WordPressSiteMetadata>): void {
    this.siteMetadata = { ...this.siteMetadata, ...metadata };
    this.touch();
  }

  public recordHealthCheck(status: HealthStatus): void {
    this.healthStatus = status;
    this.lastHealthCheck = new Date();
    this.touch();
  }

  public isHealthy(): boolean {
    return this.healthStatus === 'healthy';
  }

  public needsHealthCheck(): boolean {
    if (!this.lastHealthCheck) return true;

    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return this.lastHealthCheck < oneDayAgo;
  }

  public toJSON() {
    return {
      id: this.id,
      restaurantId: this.restaurantId,
      baseUrl: this.endpoint.getBaseUrl(),
      siteMetadata: this.siteMetadata,
      healthStatus: this.healthStatus,
      lastHealthCheck: this.lastHealthCheck,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
