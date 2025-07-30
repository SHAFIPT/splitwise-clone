import { IsString, IsUUID, IsOptional, IsEnum, IsUrl } from 'class-validator';
import { MessageType } from '@prisma/client';

export class SendMessageDto {
  @IsUUID() senderId!: string;
  @IsUUID() groupId!: string;
  @IsEnum(MessageType) type!: MessageType;
  @IsString() @IsOptional() content?: string;
  @IsUrl() @IsOptional() fileUrl?: string;
  @IsUUID() @IsOptional() replyTo?: string;
}
