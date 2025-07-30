import { Inject, Injectable } from '@nestjs/common';
import { GroupRepository } from '../repository/group.repository';
import { GroupWithMembers } from '../dtos/find-group-by-id.dto';

@Injectable()
export class FindGroupByIdUseCase {
  constructor(
    @Inject('GroupRepository')
    private readonly groupRepository: GroupRepository,
  ) {}

  async execute(groupId: string): Promise<GroupWithMembers | null> {
    return this.groupRepository.findById(groupId);
  }
}
