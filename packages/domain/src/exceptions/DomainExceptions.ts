export class DomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainException';
    Error.captureStackTrace(this, this.constructor);
  }
}

export class EntityNotFoundException extends DomainException {
  constructor(entityName: string, id: string) {
    super(`${entityName} with ID '${id}' not found`);
    this.name = 'EntityNotFoundException';
  }
}

export class InvalidOperationException extends DomainException {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidOperationException';
  }
}

export class ValidationException extends DomainException {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationException';
  }
}

export class ConcurrencyException extends DomainException {
  constructor(entityName: string, id: string) {
    super(`Concurrency conflict for ${entityName} with ID '${id}'`);
    this.name = 'ConcurrencyException';
  }
}

export class UnauthorizedException extends DomainException {
  constructor(message: string = 'Unauthorized action') {
    super(message);
    this.name = 'UnauthorizedException';
  }
}

export class BusinessRuleViolationException extends DomainException {
  constructor(rule: string, details?: string) {
    const message = details
      ? `Business rule '${rule}' violated: ${details}`
      : `Business rule '${rule}' violated`;
    super(message);
    this.name = 'BusinessRuleViolationException';
  }
}
