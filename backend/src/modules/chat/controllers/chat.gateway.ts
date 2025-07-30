import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  OnGatewayInit,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SendMessageDto } from '../dtos/send-message.dto';
import { SendMessageUseCase } from '../use-cases/send-message.use-case';
import { GetMessagesUseCase } from '../use-cases/get-messages.use-case';

@WebSocketGateway({
  namespace: '/chat',
  cors: true,
  transports: ['websocket'],
})
export class ChatGateway
  implements OnGatewayDisconnect, OnGatewayInit, OnGatewayConnection
{
  @WebSocketServer() server!: Server;

  private groupUsers = new Map<string, Map<string, Set<string>>>();
  private videoRoomUsers = new Map<string, Set<string>>();

  constructor(
    private sendMessageUC: SendMessageUseCase,
    private getMessagesUC: GetMessagesUseCase,
  ) {}

  afterInit(server: Server) {
    this.server = server;
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  @SubscribeMessage('joinGroup')
  async onJoinGroup(
    @MessageBody() data: { groupId: string; userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { groupId, userId } = data;

    await client.join(groupId);

    if (!this.groupUsers.has(groupId)) {
      this.groupUsers.set(groupId, new Map());
    }

    const groupMap = this.groupUsers.get(groupId)!;

    if (!groupMap.has(userId)) {
      groupMap.set(userId, new Set());
    }

    groupMap.get(userId)!.add(client.id);

    const history = await this.getMessagesUC.execute(groupId);
    client.emit('messageHistory', history);

    this.server.to(groupId).emit('onlineUsers', Array.from(groupMap.keys()));
  }

  @SubscribeMessage('leaveGroup')
  onLeaveGroup(
    @MessageBody() data: { groupId: string; userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { groupId, userId } = data;

    const groupMap = this.groupUsers.get(groupId);
    if (groupMap?.has(userId)) {
      groupMap.get(userId)!.delete(client.id);

      if (groupMap.get(userId)!.size === 0) {
        groupMap.delete(userId);
      }

      if (groupMap.size === 0) {
        this.groupUsers.delete(groupId);
      }

      this.server
        .to(groupId)
        .emit('onlineUsers', Array.from(groupMap?.keys() || []));
    }
  }

  @SubscribeMessage('sendMessage')
  async onSendMessage(@MessageBody() dto: SendMessageDto) {
    const msg = await this.sendMessageUC.execute(dto);

    this.server.to(dto.groupId).emit('newMessage', msg);
  }

  @SubscribeMessage('startVideoCall')
  onStartVideoCall(
    @MessageBody() data: { groupId: string; currentUserId: string },
  ) {
    const { groupId } = data;

    this.server
      .to(groupId)
      .emit('incoming-video-call', { from: data.currentUserId });
  }

  @SubscribeMessage('join-video-room')
  async onJoinVideoRoom(
    @MessageBody() data: { groupId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { groupId } = data;

    await client.join(groupId);

    if (!this.videoRoomUsers.has(groupId)) {
      this.videoRoomUsers.set(groupId, new Set());
    }

    const roomUsers = this.videoRoomUsers.get(groupId)!;
    const existingUsers = Array.from(roomUsers).filter(
      (id) => id !== client.id,
    );

    roomUsers.add(client.id);

    if (existingUsers.length > 0) {
      client.emit('existing-users', { users: existingUsers });
    }

    client.to(groupId).emit('user-joined', { userId: client.id });
  }

  @SubscribeMessage('video-offer')
  onVideoOffer(
    @MessageBody() data: { to: string; sdp: RTCSessionDescriptionInit },
    @ConnectedSocket() client: Socket,
  ) {
    this.server
      .to(data.to)
      .emit('video-offer', { from: client.id, sdp: data.sdp });
  }

  @SubscribeMessage('video-answer')
  onVideoAnswer(
    @MessageBody() data: { to: string; sdp: RTCSessionDescriptionInit },
    @ConnectedSocket() client: Socket,
  ) {
    this.server
      .to(data.to)
      .emit('video-answer', { from: client.id, sdp: data.sdp });
  }

  @SubscribeMessage('ice-candidate')
  onIceCandidate(
    @MessageBody() data: { to: string; candidate: RTCIceCandidateInit },
    @ConnectedSocket() client: Socket,
  ) {
    this.server
      .to(data.to)
      .emit('ice-candidate', { from: client.id, candidate: data.candidate });
  }

  @SubscribeMessage('leave-video-room')
  async onLeaveVideoRoom(
    @MessageBody() data: { groupId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { groupId } = data;

    await client.leave(groupId);

    const roomUsers = this.videoRoomUsers.get(groupId);
    if (roomUsers) {
      roomUsers.delete(client.id);

      if (roomUsers.size === 0) {
        this.videoRoomUsers.delete(groupId);
      }
    }

    this.server.to(groupId).emit('user-left', { userId: client.id });
  }

  handleDisconnect(client: Socket) {
    for (const [groupId, roomUsers] of this.videoRoomUsers.entries()) {
      if (roomUsers.has(client.id)) {
        roomUsers.delete(client.id);

        if (roomUsers.size === 0) {
          this.videoRoomUsers.delete(groupId);
        }
        this.server.to(groupId).emit('user-left', { userId: client.id });
      }
    }

    for (const [groupId, groupMap] of this.groupUsers.entries()) {
      for (const [userId, socketSet] of groupMap.entries()) {
        if (socketSet.has(client.id)) {
          socketSet.delete(client.id);

          if (socketSet.size === 0) {
            groupMap.delete(userId);
          }

          if (groupMap.size === 0) {
            this.groupUsers.delete(groupId);
          }

          this.server
            .to(groupId)
            .emit('onlineUsers', Array.from(groupMap.keys()));
          break;
        }
      }
    }
  }
}
