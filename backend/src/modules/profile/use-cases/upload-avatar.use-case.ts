import { Inject, Injectable } from '@nestjs/common';
import { ProfileRepository } from '../repository/profile.repository';
import { CloudinaryService } from '../services/upload.service';
import { IProfileRepositoryToken } from 'src/constants/profile.tokens';

@Injectable()
export class UploadAvatarUseCase {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    @Inject(IProfileRepositoryToken)
    private readonly repo: ProfileRepository,
  ) {}

  async execute(userId: string, file: Express.Multer.File) {
    const result = await this.cloudinaryService.uploadImage(file);
    return this.repo.updateAvatar(userId, result.secure_url);
  }
}
