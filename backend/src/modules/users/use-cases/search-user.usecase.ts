import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserMessages } from 'src/constants/messages.constant';
import { UserRepository } from '../repository/user.repository';

@Injectable()
export class SearchUserUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepo: UserRepository,
  ) {}

  async execute(email: string, excludeUserId: string) {
    const users = await this.userRepo.findUsersByEmail(email, excludeUserId);
    if (!users || users.length === 0) {
      throw new NotFoundException(UserMessages.USER_NOT_FOUND);
    }

    return users.map(({ id, name, email, avatarUrl }) => ({
      id,
      name,
      email,
      avatarUrl,
    }));
  }
}
