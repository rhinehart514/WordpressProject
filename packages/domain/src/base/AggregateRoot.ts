import { Entity } from './Entity';
import { DomainEvent } from './DomainEvent';

export abstract class AggregateRoot<T> extends Entity<T> {
  private _domainEvents: DomainEvent[] = [];
  protected _version: number = 1;

  get version(): number {
    return this._version;
  }

  get domainEvents(): DomainEvent[] {
    return this._domainEvents;
  }

  protected addDomainEvent(event: DomainEvent): void {
    this._domainEvents.push(event);
    this.touch();
  }

  public clearDomainEvents(): void {
    this._domainEvents = [];
  }

  protected incrementVersion(): void {
    this._version++;
    this.touch();
  }

  public hasDomainEvents(): boolean {
    return this._domainEvents.length > 0;
  }
}
