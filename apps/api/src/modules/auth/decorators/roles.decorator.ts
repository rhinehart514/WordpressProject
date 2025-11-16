import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

/**
 * Decorator to specify required roles for a route
 *
 * @example
 * ```typescript
 * @Roles('admin', 'agency')
 * @Get('admin-only')
 * async getAdminData() {
 *   return { message: 'Admin access only' };
 * }
 * ```
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
