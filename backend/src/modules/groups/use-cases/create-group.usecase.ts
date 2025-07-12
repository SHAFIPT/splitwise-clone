import { Inject, Injectable } from '@nestjs/common';
import { CreateGroupDto } from '../dtos/create-group.dto';
import { GroupRepository } from '../repository/group.repository';

@Injectable()
export class CreateGroupUseCase {
  constructor(
    @Inject('GroupRepository')
    private readonly groupRepo: GroupRepository,
  ) {}

  async execute(dto: CreateGroupDto): Promise<string> {
    const group = await this.groupRepo.create(dto);
    return group.id;
  }
}
