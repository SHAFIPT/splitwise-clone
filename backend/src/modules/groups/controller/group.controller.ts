import {
  Body,
  Controller,
  Get,
  Post,
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

@Controller('groups')
export class GroupController {
  constructor(
    private readonly createGroup: CreateGroupUseCase,
    private readonly getGroups: GetGroupsUseCase,
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
    @Query('search') search: string = '',
    @Query('category') category: string = '',
    @Req() req: AuthenticatedRequest,
  ): Promise<Group[]> {
    const currentUserId = req.user.userId;
    return await this.getGroups.execute(currentUserId, search, category);
  }
}
