import { Inject, Injectable } from '@nestjs/common';
import { ProfileRepository } from '../repository/profile.repository';
import { UpdateProfileDto } from '../dtos/update-profile.dto';
import { IProfileRepositoryToken } from 'src/constants/profile.tokens';

@Injectable()
export class UpdateProfileUseCase {
  constructor(
    @Inject(IProfileRepositoryToken)
    private readonly repo: ProfileRepository,
  ) {}

  async execute(userId: string, dto: UpdateProfileDto) {
    return this.repo.updateProfile(userId, dto);
  }
}
