import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpException,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateGroupDto } from '../dtos/create-group.dto';
import { CreateGroupUseCase } from '../use-cases/create-group.usecase';
import { GroupMessages } from 'src/constants/messages.constant';
import { Group } from '@prisma/client';
import { GetGroupsUseCase } from '../use-cases/GetGroupsUseCase';
import { AuthenticatedRequest } from 'src/shared/interfaces/authenticated-request.interface';
import { JwtGuard } from 'src/modules/auth/guards/jwt.guard';
import { GroupInviteService } from '../services/group-invite.service';
import { FindGroupByIdUseCase } from '../use-cases/get-group-by-id-with-members.usecase';
import { GroupWithMembers } from '../dtos/find-group-by-id.dto';
import { UpdateGroupDto } from '../dtos/update-group.dto';
import { UpdateGroupUseCase } from '../use-cases/update-group.usecase';
import { HttpStatusCodes } from 'src/constants/status.constant';
import { DeleteGroupUseCase } from '../use-cases/delete-group.usecase';
import { GetInviteLinkUseCase } from '../use-cases/get-invite-link.usecase';
import { InviteMembersToGroupUseCase } from '../use-cases/InviteMembersToGroupUseCase';
import { GetGroupByInviteTokenUseCase } from '../use-cases/GetGroupByInviteTokenUseCase';
import { JoinGroupWithInviteUseCase } from '../use-cases/joinGroupWithInviteUseCase';

@Controller('groups')
export class GroupController {
  constructor(
    private readonly createGroup: CreateGroupUseCase,
    private readonly getGroups: GetGroupsUseCase,
    private readonly groupInviteService: GroupInviteService,
    private readonly getGroupByInviteTokenUseCase: GetGroupByInviteTokenUseCase,
    private readonly findGroupById: FindGroupByIdUseCase,
    private readonly updateGroup: UpdateGroupUseCase,
    private readonly deleteGroupUseCase: DeleteGroupUseCase,
    private readonly getInviteLinkUseCase: GetInviteLinkUseCase,
    private readonly groupMemberAdd: InviteMembersToGroupUseCase,
    private readonly joinGroupWithInviteUseCase: JoinGroupWithInviteUseCase,
  ) {}
  @UseGuards(JwtGuard)
  @Post('create')
  async create(@Body() dto: CreateGroupDto, @Req() req: AuthenticatedRequest) {
    const currentUserId = req.user.userId;
    const groupId = await this.createGroup.execute({
      ...dto,
      creatorId: currentUserId,
    });
    return { message: GroupMessages.GROUP_CREATED, groupId };
  }

  @UseGuards(JwtGuard)
  @Get()
  async getGroup(
    @Query('search') search = '',
    @Query('category') category = '',
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Req() req: AuthenticatedRequest,
  ): Promise<{ data: Group[]; total: number }> {
    const currentUserId = req.user.userId;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    return await this.getGroups.execute(
      currentUserId,
      search,
      category,
      pageNumber,
      limitNumber,
    );
  }

  @UseGuards(JwtGuard)
  @Post(':groupId/invite-link')
  async generateInviteLink(
    @Param('groupId') groupId: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<{ inviteLink: string }> {
    const userId = req.user.userId;
    const inviteLink = await this.groupInviteService.generateInviteLink(
      groupId,
      userId,
    );
    return { inviteLink };
  }

  @UseGuards(JwtGuard)
  @Get(':groupId/invite-link')
  async getInviteLink(
    @Param('groupId') groupId: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<{ inviteLink: string; expiresAt: Date }> {
    const userId = req.user.userId;
    const { inviteLink, expiresAt } = await this.getInviteLinkUseCase.execute(
      groupId,
      userId,
    );
    return { inviteLink, expiresAt };
  }

  @UseGuards(JwtGuard)
  @Post(':groupId/invite')
  async inviteMembersToGroup(
    @Param('groupId') groupId: string,
    @Body() body: { members: { id: string }[] },
    @Req() req: AuthenticatedRequest,
  ): Promise<{ message: string }> {
    const userId = req.user.userId;
    await this.groupMemberAdd.execute(groupId, body.members, userId);
    return { message: 'Members invited successfully' };
  }

  @UseGuards(JwtGuard)
  @Get(':groupId')
  async getGroupById(
    @Param('groupId') groupId: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<GroupWithMembers> {
    const userId = req.user.userId;
    const group = await this.findGroupById.execute(groupId);

    if (!group) {
      throw new NotFoundException(GroupMessages.GROUP_NOT_FOUND);
    }

    const isMember = group.members.some((m) => m.id === userId);
    if (!isMember) {
      throw new ForbiddenException(GroupMessages.NOT_GROUP_MEMBER);
    }

    return group;
  }

  @Get('invite/:token')
  async getGroupDetailsByInviteToken(@Param('token') token: string) {
    const group =
      await this.getGroupByInviteTokenUseCase.getGroupByInviteToken(token);
    if (!group) {
      throw new NotFoundException('Invalid or expired invite token');
    }
    return group;
  }

  @UseGuards(JwtGuard)
  @Post(':token/join')
  async joinGroupWithInvite(
    @Param('token') token: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<{ message: string }> {
    const userId = req.user.userId;
    await this.joinGroupWithInviteUseCase.execute(token, userId);
    return { message: 'Successfully joined the group!' };
  }

  @UseGuards(JwtGuard)
  @Put(':groupId')
  async updateGroupById(
    @Param('groupId') groupId: string,
    @Body() data: UpdateGroupDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<{ message: string }> {
    try {
      const userId = req.user.userId;
      console.dir(data, { depth: null });
      await this.updateGroup.execute(groupId, data, userId);
      return { message: GroupMessages.GROUP_UPDATED };
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }

      if (error instanceof Error) {
        throw new Error(`${GroupMessages.UPDATE_FAILD}: ${error.message}`);
      }

      throw new Error(GroupMessages.UPDATE_FAILD);
    }
  }

  @UseGuards(JwtGuard)
  @Delete(':groupId')
  async deleteGroupById(
    @Param('groupId') groupId: string,
  ): Promise<{ message: string }> {
    const success = await this.deleteGroupUseCase.execute(groupId);
    if (!success) {
      throw new HttpException(
        GroupMessages.GROUP_NOT_FOUND,
        HttpStatusCodes.NOT_FOUND,
      );
    }
    return { message: GroupMessages.GROUP_DELETED };
  }
}
