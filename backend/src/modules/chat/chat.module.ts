// chat/chat.module.ts
import { Module } from '@nestjs/common';
import { ChatGateway } from './controllers/chat.gateway';
import { PrismaService } from 'src/database/prisma.service';
import { SendMessageUseCase } from './use-cases/send-message.use-case';
import { GetMessagesUseCase } from './use-cases/get-messages.use-case';
import { PrismaChatRepository } from './infra/chat.prisma-repo';
import { ChatRepository } from './repositories/chat.repository';
import { PrismaUnreadMessagesRepository } from './infra/unread.prisma-repo';
import { UnreadMessagesUseCase } from './use-cases/unread-messages.use-case';
import { UnreadMessagesRepository } from './repositories/unread-messages.repository';

@Module({
  providers: [
    ChatGateway,
    PrismaService,

    {
      provide: 'ChatRepository',
      useClass: PrismaChatRepository,
    },
    {
      provide: SendMessageUseCase,
      useFactory: (repo: ChatRepository) => new SendMessageUseCase(repo),
      inject: ['ChatRepository'],
    },
    {
      provide: GetMessagesUseCase,
      useFactory: (repo: ChatRepository) => new GetMessagesUseCase(repo),
      inject: ['ChatRepository'],
    },
    {
      provide: 'UnreadMessagesRepository',
      useClass: PrismaUnreadMessagesRepository,
    },
    {
      provide: UnreadMessagesUseCase,
      useFactory: (repo: UnreadMessagesRepository) =>
        new UnreadMessagesUseCase(repo),
      inject: ['UnreadMessagesRepository'],
    },
  ],
})
export class ChatModule {}
