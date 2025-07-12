import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateGroupDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  category!: string;

  @IsString()
  image!: string;

  @IsArray()
  members!: string[];

  @IsOptional()
  @IsString()
  creatorId?: string;
}
