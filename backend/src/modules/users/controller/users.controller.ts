import {
  BadRequestException,
  Controller,
  Get,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SearchUserUseCase } from '../use-cases/search-user.usecase';
import { UserMessages } from 'src/constants/messages.constant';
import { AuthenticatedRequest } from 'src/shared/interfaces/authenticated-request.interface';
import { JwtGuard } from 'src/modules/auth/guards/jwt.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly searchUserUseCase: SearchUserUseCase) {}
  @UseGuards(JwtGuard)
  @Get('search')
  searchUser(@Query('email') email: string, @Req() req: AuthenticatedRequest) {
    if (!email || email.trim().length === 0) {
      throw new BadRequestException(UserMessages.EMAIL_QUERY_REQUIED);
    }
    const currentUserId = req.user.userId;
    return this.searchUserUseCase.execute(email, currentUserId);
  }
}
