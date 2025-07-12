import { Module } from '@nestjs/common';
import { UsersController } from './controller/users.controller';
import { SearchUserUseCase } from './use-cases/search-user.usecase';
import { PrismaUserRepository } from './infra/prisma-user.repository';

@Module({
  controllers: [UsersController],
  providers: [
    SearchUserUseCase,
    { provide: 'UserRepository', useClass: PrismaUserRepository },
  ],
})
export class UsersModule {}
