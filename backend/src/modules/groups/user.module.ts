import { Module } from '@nestjs/common';
import { GroupController } from './controller/group.controller';
import { CreateGroupUseCase } from './use-cases/create-group.usecase';
import { PrismaGroupRepository } from './infra/prisma-group.repository';
import { GetGroupsUseCase } from './use-cases/GetGroupsUseCase';

@Module({
  controllers: [GroupController],
  providers: [
    CreateGroupUseCase,
    GetGroupsUseCase,
    { provide: 'GroupRepository', useClass: PrismaGroupRepository },
  ],
})
export class GroupsModule {}
