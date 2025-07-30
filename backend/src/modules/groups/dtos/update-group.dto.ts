import { IsOptional, IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class MemberDto {
  @IsOptional()
  @IsString()
  id?: string; // User ID

  @IsOptional()
  @IsString()
  userId?: string; // Alternative user ID field

  @IsOptional()
  @IsString()
  memberId?: string; // GroupMember ID

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  user?: {
    id: string;
    name?: string;
    avatarUrl?: string;
    email?: string;
  };
}

export class UpdateGroupDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MemberDto)
  members?: MemberDto[];
}
