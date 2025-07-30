import {
  Inject,
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { GroupRepository } from '../repository/group.repository';

@Injectable()
export class JoinGroupWithInviteUseCase {
  constructor(
    @Inject('GroupRepository')
    private readonly groupRepository: GroupRepository,
  ) {}

  async execute(token: string, userId: string): Promise<void> {
    const inviteData = await this.groupRepository.findGroupByInviteToken(token);

    if (!inviteData) {
      throw new NotFoundException('Invalid or expired invite token');
    }
    if (inviteData.expiresAt < new Date()) {
      throw new BadRequestException('Invite token has expired');
    }

    const isAlreadyMember = inviteData.members.some(
      (member) => member.id === userId,
    );

    if (isAlreadyMember) {
      throw new BadRequestException('You are already a member of this group');
    }

    await this.groupRepository.joinGroupWithInvite(
      inviteData.id,
      userId,
      token,
    );
  }
}
