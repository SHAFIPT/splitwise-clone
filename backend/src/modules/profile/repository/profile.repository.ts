import { UpdateProfileDto } from '../dtos/update-profile.dto';

export interface ProfileRepository {
  updateProfile(userId: string, dto: UpdateProfileDto): Promise<User>;
  updateAvatar(userId: string, avatarUrl: string): Promise<User>;
}
