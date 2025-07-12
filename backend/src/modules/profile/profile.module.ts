import { Module } from '@nestjs/common';
import { ProfileController } from './controller/profile.controller';
import { PrismaModule } from 'src/database/prisma.module';
import { CloudinaryService } from './services/upload.service';
import { UpdateProfileUseCase } from './use-cases/update-profile.use-case';
import { UploadAvatarUseCase } from './use-cases/upload-avatar.use-case';
import { IProfileRepositoryToken } from 'src/constants/profile.tokens';
import { PrismaProfileRepository } from './infra/prisma-profile.repository';

@Module({
  imports: [PrismaModule],
  controllers: [ProfileController],
  providers: [
    CloudinaryService,
    UpdateProfileUseCase,
    UploadAvatarUseCase,
    {
      provide: IProfileRepositoryToken,
      useClass: PrismaProfileRepository,
    },
  ],
})
export class ProfileModule {}
