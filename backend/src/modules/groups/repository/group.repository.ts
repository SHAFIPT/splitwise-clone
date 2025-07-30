import { CreateGroupDto } from '../dtos/create-group.dto';
import { Group } from '@prisma/client';
import { UpdateGroupDto } from '../dtos/update-group.dto';
import { GroupWithMembersDto } from '../dtos/GroupWithMembersDto';
import { InvitableGroupDto } from '../dtos/InvitableGroupDto';

export interface GroupRepository {
  create(data: CreateGroupDto): Promise<Group>;
  findMany(
    userId: string,
    search: string,
    category: string,
    page: number,
    limit: number,
  ): Promise<{ data: Group[]; total: number }>;
  findById(id: string): Promise<GroupWithMembersDto | null>;
  update(groupId: string, data: UpdateGroupDto): Promise<void>;
  delete(groupId: string): Promise<boolean>;
  findLatestInviteTokenRecord(
    groupId: string,
  ): Promise<{ token: string; expiresAt: Date } | null>;
  addMembers(
    groupId: string,
    members: { id: string; role: string }[],
  ): Promise<void>;
  findGroupByInviteToken(token: string): Promise<InvitableGroupDto | null>;
  joinGroupWithInvite(
    groupId: string,
    userId: string,
    token: string,
  ): Promise<void>;
}
