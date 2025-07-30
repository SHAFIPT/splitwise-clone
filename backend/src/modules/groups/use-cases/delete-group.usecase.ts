import { Inject, Injectable } from '@nestjs/common';
import { GroupRepository } from '../repository/group.repository';

@Injectable()
export class DeleteGroupUseCase {
  constructor(
    @Inject('GroupRepository')
    private readonly groupRepository: GroupRepository,
  ) {}

  async execute(groupId: string): Promise<boolean> {
    return await this.groupRepository.delete(groupId);
  }
}
