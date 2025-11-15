import { DomainEvent } from '../../base/DomainEvent';

export interface PreviewUrls {
  homepage: string;
  menu?: string;
  about?: string;
  contact?: string;
  gallery?: string;
}

export class PreviewCreated extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly previewUrls: PreviewUrls,
  ) {
    super(aggregateId);
  }

  getEventName(): string {
    return 'content_rebuild.preview_created';
  }

  protected getPayload(): Record<string, any> {
    return {
      previewUrls: this.previewUrls,
    };
  }
}
