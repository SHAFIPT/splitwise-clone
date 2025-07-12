import {
  Controller,
  Put,
  UseGuards,
  Body,
  UploadedFile,
  UseInterceptors,
  Req,
  Post,
} from '@nestjs/common';
import { JwtGuard } from 'src/modules/auth/guards/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateProfileUseCase } from '../use-cases/update-profile.use-case';
import { UploadAvatarUseCase } from '../use-cases/upload-avatar.use-case';
import { UpdateProfileDto } from '../dtos/update-profile.dto';
import { AuthenticatedRequest } from 'src/shared/interfaces/authenticated-request.interface';

@Controller('profile')
@UseGuards(JwtGuard)
export class ProfileController {
  constructor(
    private readonly updateProfileUseCase: UpdateProfileUseCase,
    private readonly uploadAvatarUseCase: UploadAvatarUseCase,
  ) {}

  @Put('update')
  updateProfile(
    @Body() dto: UpdateProfileDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.userId;
    return this.updateProfileUseCase.execute(userId, dto);
  }

  @Post('upload-avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.userId;
    return this.uploadAvatarUseCase.execute(userId, file);
  }
}
