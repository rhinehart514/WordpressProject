import { DomainEvent } from '../../base/DomainEvent';

export class DeploymentCompleted extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly success: boolean,
    public readonly deployedPageCount: number,
    public readonly errorCount: number,
  ) {
    super(aggregateId);
  }

  getEventName(): string {
    return 'wordpress_deployment.deployment_completed';
  }

  protected getPayload(): Record<string, any> {
    return {
      success: this.success,
      deployedPageCount: this.deployedPageCount,
      errorCount: this.errorCount,
    };
  }
}
