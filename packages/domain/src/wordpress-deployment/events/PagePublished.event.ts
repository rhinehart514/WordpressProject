import { DomainEvent } from '../../base/DomainEvent';

export class PagePublished extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly pageType: string,
    public readonly wordpressPageId: number,
    public readonly pageUrl: string,
  ) {
    super(aggregateId);
  }

  getEventName(): string {
    return 'wordpress_deployment.page_published';
  }

  protected getPayload(): Record<string, any> {
    return {
      pageType: this.pageType,
      wordpressPageId: this.wordpressPageId,
      pageUrl: this.pageUrl,
    };
  }
}
