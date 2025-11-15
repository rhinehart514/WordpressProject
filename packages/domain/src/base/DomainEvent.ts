import { v4 as uuidv4 } from 'uuid';

export abstract class DomainEvent {
  public readonly eventId: string;
  public readonly occurredOn: Date;
  public readonly aggregateId: string;

  constructor(aggregateId: string) {
    this.eventId = uuidv4();
    this.aggregateId = aggregateId;
    this.occurredOn = new Date();
  }

  abstract getEventName(): string;

  public toJSON(): Record<string, any> {
    return {
      eventId: this.eventId,
      eventName: this.getEventName(),
      aggregateId: this.aggregateId,
      occurredOn: this.occurredOn.toISOString(),
      ...this.getPayload(),
    };
  }

  protected abstract getPayload(): Record<string, any>;
}
