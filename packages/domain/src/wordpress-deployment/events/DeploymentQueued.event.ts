import { DomainEvent } from '../../base/DomainEvent';

export class DeploymentQueued extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly rebuildId: string,
    public readonly wordPressSiteId: string,
  ) {
    super(aggregateId);
  }

  getEventName(): string {
    return 'wordpress_deployment.deployment_queued';
  }

  protected getPayload(): Record<string, any> {
    return {
      rebuildId: this.rebuildId,
      wordPressSiteId: this.wordPressSiteId,
    };
  }
}
