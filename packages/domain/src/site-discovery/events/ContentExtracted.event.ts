import { DomainEvent } from '../../base/DomainEvent';

export class ContentExtracted extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly pageId: string,
    public readonly blockCount: number,
    public readonly assetCount: number,
  ) {
    super(aggregateId);
  }

  getEventName(): string {
    return 'site_discovery.content_extracted';
  }

  protected getPayload(): Record<string, any> {
    return {
      pageId: this.pageId,
      blockCount: this.blockCount,
      assetCount: this.assetCount,
    };
  }
}
