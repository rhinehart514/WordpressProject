import { DomainEvent } from '../../base/DomainEvent';

export class SiteScraped extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly pageCount: number,
    public readonly url: string,
  ) {
    super(aggregateId);
  }

  getEventName(): string {
    return 'site_discovery.site_scraped';
  }

  protected getPayload(): Record<string, any> {
    return {
      pageCount: this.pageCount,
      url: this.url,
    };
  }
}
