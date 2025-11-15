import { ValueObject } from '../../base/ValueObject';
import { ValidationException } from '../../exceptions/DomainExceptions';

export enum PageTypeEnum {
  HOMEPAGE = 'homepage',
  MENU = 'menu',
  ABOUT = 'about',
  CONTACT = 'contact',
  GALLERY = 'gallery',
  HOURS = 'hours',
  UNKNOWN = 'unknown',
}

export class PageType extends ValueObject<{ type: PageTypeEnum; confidence: number }> {
  private readonly type: PageTypeEnum;
  private readonly confidence: number;

  constructor(type: PageTypeEnum, confidence: number) {
    super();
    this.validate(type, confidence);
    this.type = type;
    this.confidence = confidence;
  }

  private validate(type: PageTypeEnum, confidence: number): void {
    if (!Object.values(PageTypeEnum).includes(type)) {
      throw new ValidationException(`Invalid page type: ${type}`);
    }

    if (confidence < 0 || confidence > 1) {
      throw new ValidationException('Confidence must be between 0 and 1');
    }
  }

  public getType(): PageTypeEnum {
    return this.type;
  }

  public getConfidence(): number {
    return this.confidence;
  }

  public isHighConfidence(): boolean {
    return this.confidence >= 0.8;
  }

  public isLowConfidence(): boolean {
    return this.confidence < 0.5;
  }

  protected getEqualityComponents(): any[] {
    return [this.type, this.confidence];
  }

  public toString(): string {
    return `${this.type} (${(this.confidence * 100).toFixed(0)}%)`;
  }
}
