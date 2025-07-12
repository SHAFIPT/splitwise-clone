import { PublicUser } from '../dtos/public-user.dto';

export interface UserRepository {
  findUsersByEmail(email: string, excludeUserId: string): Promise<PublicUser[]>;
}
