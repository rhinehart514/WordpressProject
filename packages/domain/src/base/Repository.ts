import { AggregateRoot } from './AggregateRoot';

export interface IRepository<T extends AggregateRoot<any>> {
  /**
   * Find an aggregate by its ID
   */
  findById(id: string): Promise<T | null>;

  /**
   * Save an aggregate (create or update)
   */
  save(aggregate: T): Promise<T>;

  /**
   * Delete an aggregate by its ID
   */
  delete(id: string): Promise<void>;

  /**
   * Check if an aggregate exists
   */
  exists(id: string): Promise<boolean>;
}

export interface IReadRepository<T> {
  /**
   * Find by ID (read-only)
   */
  findById(id: string): Promise<T | null>;

  /**
   * Find all with optional filtering
   */
  findAll(filter?: any): Promise<T[]>;

  /**
   * Find with pagination
   */
  findPaginated(
    page: number,
    limit: number,
    filter?: any
  ): Promise<{
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>;

  /**
   * Count total records
   */
  count(filter?: any): Promise<number>;
}
