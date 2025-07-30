import { Inject, Injectable } from '@nestjs/common';
import { GroupRepository } from '../repository/group.repository';

@Injectable()
export class GetGroupByInviteTokenUseCase {
  constructor(
    @Inject('GroupRepository')
    private readonly groupRepository: GroupRepository,
  ) {}

  async getGroupByInviteToken(token: string) {
    return await this.groupRepository.findGroupByInviteToken(token);
  }
}
