import { CreateGroupDto } from '../dtos/create-group.dto';
import { Group } from '@prisma/client';

export interface GroupRepository {
  create(data: CreateGroupDto): Promise<Group>;
  findMany(userId: string, search: string, category: string): Promise<Group[]>;
}
