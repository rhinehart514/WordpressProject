import { DomainEvent } from '../../base/DomainEvent';

export class RebuildGenerated extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly pageCount: number,
    public readonly templateId: string,
  ) {
    super(aggregateId);
  }

  getEventName(): string {
    return 'content_rebuild.rebuild_generated';
  }

  protected getPayload(): Record<string, any> {
    return {
      pageCount: this.pageCount,
      templateId: this.templateId,
    };
  }
}
