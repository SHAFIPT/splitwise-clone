import { Inject, Injectable } from '@nestjs/common';
import { GroupRepository } from '../repository/group.repository';
import { Group } from '@prisma/client';

@Injectable()
export class GetGroupsUseCase {
  constructor(
    @Inject('GroupRepository')
    private readonly groupRepo: GroupRepository,
  ) {}

  async execute(
    userId: string,
    search: string,
    category: string,
    page: number,
    limit: number,
  ): Promise<{ data: Group[]; total: number }> {
    return this.groupRepo.findMany(userId, search, category, page, limit);
  }
}
