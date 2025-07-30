import { Inject, Injectable } from '@nestjs/common';
import { GroupRepository } from '../repository/group.repository';
import { GroupInviteService } from '../services/group-invite.service';

@Injectable()
export class GetInviteLinkUseCase {
  constructor(
    @Inject('GroupRepository')
    private readonly groupRepo: GroupRepository,
    private readonly groupInviteService: GroupInviteService,
  ) {}

  async execute(
    groupId: string,
    userId: string,
  ): Promise<{ inviteLink: string; expiresAt: Date }> {
    const tokenRecord =
      await this.groupRepo.findLatestInviteTokenRecord(groupId);

    if (tokenRecord) {
      return {
        inviteLink: `http://localhost:3000/join/${tokenRecord.token}`,
        expiresAt: tokenRecord.expiresAt,
      };
    }

    // no valid token found → generate a new one
    const inviteLink = await this.groupInviteService.generateInviteLink(
      groupId,
      userId,
    );

    // get the new token record after creation
    const newRecord = await this.groupRepo.findLatestInviteTokenRecord(groupId);
    if (!newRecord) throw new Error('Failed to generate invite token');

    return {
      inviteLink,
      expiresAt: newRecord.expiresAt,
    };
  }
}
