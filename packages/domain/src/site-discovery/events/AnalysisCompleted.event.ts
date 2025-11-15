import { DomainEvent } from '../../base/DomainEvent';

export class AnalysisCompleted extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly totalPages: number,
    public readonly totalBlocks: number,
    public readonly success: boolean,
  ) {
    super(aggregateId);
  }

  getEventName(): string {
    return 'site_discovery.analysis_completed';
  }

  protected getPayload(): Record<string, any> {
    return {
      totalPages: this.totalPages,
      totalBlocks: this.totalBlocks,
      success: this.success,
    };
  }
}
