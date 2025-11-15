import { IsString, IsOptional, IsUUID } from 'class-validator';

export class SendMessageDto {
  @IsString()
  content: string;

  @IsOptional()
  @IsUUID()
  conversationId?: string;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  metadata?: any;
}
