import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { GroupController } from './controller/group.controller';
import { CreateGroupUseCase } from './use-cases/create-group.usecase';
import { GetGroupsUseCase } from './use-cases/GetGroupsUseCase';
import { GroupInviteService } from './services/group-invite.service';
import { PrismaGroupRepository } from './infra/prisma-group.repository';
import { PrismaService } from 'src/database/prisma.service';
import { FindGroupByIdUseCase } from './use-cases/get-group-by-id-with-members.usecase';
import { DeleteGroupUseCase } from './use-cases/delete-group.usecase';
import { UpdateGroupUseCase } from './use-cases/update-group.usecase';
import { GetInviteLinkUseCase } from './use-cases/get-invite-link.usecase';
import { InviteMembersToGroupUseCase } from './use-cases/InviteMembersToGroupUseCase';
import { GetGroupByInviteTokenUseCase } from './use-cases/GetGroupByInviteTokenUseCase';
import { JoinGroupWithInviteUseCase } from './use-cases/joinGroupWithInviteUseCase';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [GroupController],
  providers: [
    CreateGroupUseCase,
    GetGroupsUseCase,
    FindGroupByIdUseCase,
    GroupInviteService,
    PrismaService,
    UpdateGroupUseCase,
    DeleteGroupUseCase,
    GetInviteLinkUseCase,
    InviteMembersToGroupUseCase,
    GetGroupByInviteTokenUseCase,
    JoinGroupWithInviteUseCase,
    { provide: 'GroupRepository', useClass: PrismaGroupRepository },
  ],
})
export class GroupsModule {}
