import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import {
  RegisterDto,
  LoginDto,
  LoginResponse,
  RefreshTokenDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from './auth.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor() {
    // TODO: Inject AuthService once created
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input or email already exists',
  })
  async register(@Body() registerDto: RegisterDto) {
    // TODO: Implement user registration
    // 1. Validate email doesn't exist
    // 2. Hash password with bcrypt
    // 3. Create user in database
    // 4. Generate JWT token
    // 5. Return user + token
    throw new Error('Not implemented - requires AuthService');
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: LoginResponse,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
  })
  async login(@Body() loginDto: LoginDto): Promise<LoginResponse> {
    // TODO: Implement login
    // 1. Find user by email
    // 2. Verify password with bcrypt
    // 3. Generate JWT token
    // 4. Return user + token
    throw new Error('Not implemented - requires AuthService');
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({
    status: 200,
    description: 'Logout successful',
  })
  async logout() {
    // TODO: Implement logout
    // For JWT, this is typically client-side (remove token)
    // Could implement token blacklisting here if needed
    return { message: 'Logged out successfully' };
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Current user profile',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async getCurrentUser(@Request() req: any) {
    // TODO: Implement get current user
    // Requires JwtAuthGuard to be applied
    // User will be available in req.user after guard validation
    throw new Error('Not implemented - requires JwtAuthGuard');
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({
    status: 200,
    description: 'Token refreshed successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid refresh token',
  })
  async refresh(@Body() refreshDto: RefreshTokenDto) {
    // TODO: Implement token refresh
    // 1. Validate refresh token
    // 2. Generate new access token
    // 3. Return new token
    throw new Error('Not implemented - requires AuthService');
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request password reset' })
  @ApiResponse({
    status: 200,
    description: 'Password reset email sent',
  })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    // TODO: Implement password reset request
    // 1. Generate reset token
    // 2. Send email with reset link
    // 3. Return success message
    throw new Error('Not implemented - requires AuthService and EmailService');
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password with token' })
  @ApiResponse({
    status: 200,
    description: 'Password reset successful',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid or expired token',
  })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    // TODO: Implement password reset
    // 1. Validate reset token
    // 2. Hash new password
    // 3. Update user password
    // 4. Invalidate reset token
    throw new Error('Not implemented - requires AuthService');
  }
}
