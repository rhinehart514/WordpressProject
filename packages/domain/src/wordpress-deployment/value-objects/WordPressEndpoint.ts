import { ValueObject } from '../../base/ValueObject';
import { ValidationException } from '../../exceptions/DomainExceptions';

export class WordPressEndpoint extends ValueObject<{ baseUrl: string; apiKey: string }> {
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor(baseUrl: string, apiKey: string) {
    super();
    this.validate(baseUrl, apiKey);
    this.baseUrl = this.normalizeUrl(baseUrl);
    this.apiKey = apiKey;
  }

  private validate(baseUrl: string, apiKey: string): void {
    if (!baseUrl || baseUrl.trim().length === 0) {
      throw new ValidationException('Base URL cannot be empty');
    }

    if (!apiKey || apiKey.trim().length === 0) {
      throw new ValidationException('API key cannot be empty');
    }

    try {
      new URL(baseUrl);
    } catch (error) {
      throw new ValidationException(`Invalid base URL format: ${baseUrl}`);
    }
  }

  private normalizeUrl(url: string): string {
    // Remove trailing slash
    return url.replace(/\/$/, '');
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  public getApiKey(): string {
    return this.apiKey;
  }

  public getCreatePageUrl(): string {
    return `${this.baseUrl}/wp-json/bricks-api/v1/create-restaurant-page`;
  }

  public getMediaUploadUrl(): string {
    return `${this.baseUrl}/wp-json/wp/v2/media`;
  }

  public getHealthCheckUrl(): string {
    return `${this.baseUrl}/wp-json/bricks-api/v1/health`;
  }

  protected getEqualityComponents(): any[] {
    return [this.baseUrl, this.apiKey];
  }
}
