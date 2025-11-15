import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UserRepository } from '../../repositories';
import { PrismaService } from '../../prisma';
import { UpdateUserDto, ChangePasswordDto } from './user.dto';

@ApiTags('Users')
@Controller('users')
@ApiBearerAuth()
export class UserController {
  private readonly userRepository: UserRepository;

  constructor(private readonly prisma: PrismaService) {
    this.userRepository = new UserRepository(prisma);
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    description: 'Current user profile',
  })
  async getCurrentUser(@Request() req: any) {
    // TODO: Get user from JWT guard
    // const userId = req.user.id;
    // return this.userRepository.findById(userId);
    throw new Error('Not implemented - requires JwtAuthGuard');
  }

  @Put('me')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({
    status: 200,
    description: 'Profile updated successfully',
  })
  async updateCurrentUser(
    @Request() req: any,
    @Body() updateDto: UpdateUserDto,
  ) {
    // TODO: Get user from JWT guard
    // const userId = req.user.id;
    // return this.userRepository.update(userId, updateDto);
    throw new Error('Not implemented - requires JwtAuthGuard');
  }

  @Put('me/password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Change password' })
  @ApiResponse({
    status: 200,
    description: 'Password changed successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid current password',
  })
  async changePassword(
    @Request() req: any,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    // TODO: Implement password change
    // 1. Get user from JWT guard
    // 2. Verify current password
    // 3. Hash new password
    // 4. Update password in database
    throw new Error('Not implemented - requires AuthService');
  }

  @Get('me/conversations')
  @ApiOperation({ summary: 'Get user conversations' })
  @ApiResponse({
    status: 200,
    description: 'User conversations',
  })
  async getUserConversations(@Request() req: any) {
    // TODO: Get user from JWT guard
    // const userId = req.user.id;
    // return this.userRepository.findByIdWithConversations(userId);
    throw new Error('Not implemented - requires JwtAuthGuard');
  }

  @Get()
  @ApiOperation({ summary: 'Get all users (admin only)' })
  @ApiResponse({
    status: 200,
    description: 'List of users',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - admin only',
  })
  async findAll(@Query('limit') limit?: number) {
    // TODO: Add RolesGuard for admin check
    return this.userRepository.findAll(limit ? parseInt(limit.toString()) : 100);
  }

  @Get('role/:role')
  @ApiOperation({ summary: 'Get users by role (admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Users with specified role',
  })
  async findByRole(@Param('role') role: string) {
    // TODO: Add RolesGuard for admin check
    return this.userRepository.findByRole(role);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID (admin only)' })
  @ApiResponse({
    status: 200,
    description: 'User found',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async findOne(@Param('id') id: string) {
    // TODO: Add RolesGuard for admin check
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    // Remove password hash before returning
    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user (admin only)' })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
  })
  async update(@Param('id') id: string, @Body() updateDto: UpdateUserDto) {
    // TODO: Add RolesGuard for admin check
    return this.userRepository.update(id, updateDto);
  }

  @Put(':id/deactivate')
  @ApiOperation({ summary: 'Deactivate user (admin only)' })
  @ApiResponse({
    status: 200,
    description: 'User deactivated successfully',
  })
  async deactivate(@Param('id') id: string) {
    // TODO: Add RolesGuard for admin check
    return this.userRepository.deactivate(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete user permanently (admin only)' })
  @ApiResponse({
    status: 204,
    description: 'User deleted successfully',
  })
  async delete(@Param('id') id: string) {
    // TODO: Add RolesGuard for admin check
    await this.userRepository.delete(id);
  }

  @Get('stats/by-role')
  @ApiOperation({ summary: 'Get user count by role (admin only)' })
  @ApiResponse({
    status: 200,
    description: 'User statistics',
  })
  async getStatsByRole(@Query('role') role: string) {
    // TODO: Add RolesGuard for admin check
    const count = await this.userRepository.countByRole(role);
    return { role, count };
  }
}
