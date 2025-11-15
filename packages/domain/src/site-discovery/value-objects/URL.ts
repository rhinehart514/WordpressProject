import { ValueObject } from '../../base/ValueObject';
import { ValidationException } from '../../exceptions/DomainExceptions';

export class URL extends ValueObject<string> {
  private readonly value: string;

  constructor(url: string) {
    super();
    this.validate(url);
    this.value = this.normalize(url);
  }

  private validate(url: string): void {
    if (!url || url.trim().length === 0) {
      throw new ValidationException('URL cannot be empty');
    }

    try {
      new globalThis.URL(url);
    } catch (error) {
      throw new ValidationException(`Invalid URL format: ${url}`);
    }
  }

  private normalize(url: string): string {
    const urlObj = new globalThis.URL(url);
    // Remove trailing slash
    return urlObj.href.replace(/\/$/, '');
  }

  public getValue(): string {
    return this.value;
  }

  public getDomain(): string {
    const urlObj = new globalThis.URL(this.value);
    return urlObj.hostname;
  }

  public getProtocol(): string {
    const urlObj = new globalThis.URL(this.value);
    return urlObj.protocol.replace(':', '');
  }

  protected getEqualityComponents(): any[] {
    return [this.value];
  }

  public toString(): string {
    return this.value;
  }
}
