import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Socket } from 'socket.io-client';
import * as jwt from 'jsonwebtoken';
import { LoggedUserPayload } from '../common/interfaces/logged-user-payload.interface';

@WebSocketGateway()
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private connectedUsers = new Map<number, string>();

  @WebSocketServer()
  server: Server;

  async handleConnection(socket: Socket) {
    const user = jwt.verify(
      socket.handshake.headers.authorization,
      process.env.JWT_SECRET,
    ) as unknown as LoggedUserPayload;
    this.connectedUsers.set(user.sub, socket.id);

    console.log(`User connected: ${socket.id}`);
  }

  async handleDisconnect(socket: Socket) {
    console.log(`User disconnected: ${socket.id}`);
  }

  createRecipeNotification(payload: string, userId: number) {
    const user = this.connectedUsers.get(userId);

    if (user) {
      this.server.to(user).emit('notification', payload);
    }
  }
}
