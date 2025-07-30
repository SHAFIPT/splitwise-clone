import { Inject, Injectable, ForbiddenException } from '@nestjs/common';
import { GroupRepository } from '../repository/group.repository';
import { UpdateGroupDto } from '../dtos/update-group.dto';

@Injectable()
export class UpdateGroupUseCase {
  constructor(
    @Inject('GroupRepository')
    private readonly groupRepository: GroupRepository,
  ) {}

  async execute(
    groupId: string,
    data: UpdateGroupDto,
    currentUserId: string,
  ): Promise<void> {
    const group = await this.groupRepository.findById(groupId);

    if (!group) throw new Error('Group not found');

    const currentUserMember = group.members.find(
      (member) => member.id === currentUserId,
    );

    if (!currentUserMember) {
      throw new ForbiddenException('You are not a member of this group');
    }

    const canEdit = ['admin', 'editor'].includes(currentUserMember.role);

    if (!canEdit) {
      throw new ForbiddenException(
        'You are not authorized to update this group. Only admins and editors can make changes.',
      );
    }

    await this.groupRepository.update(groupId, data);
  }
}
