import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { GroupRepository } from '../repository/group.repository';

@Injectable()
export class InviteMembersToGroupUseCase {
  constructor(
    @Inject('GroupRepository')
    private readonly groupRepository: GroupRepository,
  ) {}

  async execute(
    groupId: string,
    members: { id: string }[],
    invitedById: string,
  ): Promise<void> {
    const group = await this.groupRepository.findById(groupId);
    if (!group) {
      throw new Error('Group not found');
    }

    const isInviterMember = group.members.some((m) => m.id === invitedById);
    if (!isInviterMember) {
      throw new ForbiddenException('You are not a member of this group');
    }

    const existingMemberIds = group.members.map((m) => m.id);
    const newMembers = members.filter((m) => !existingMemberIds.includes(m.id));

    if (newMembers.length === 0) {
      throw new ConflictException(
        'All selected users are already group members',
      );
    }

    await this.groupRepository.addMembers(
      groupId,
      newMembers.map((m) => ({ id: m.id, role: 'viewer' })),
    );
  }
}
