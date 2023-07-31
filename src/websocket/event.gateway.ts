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
import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';

@WebSocketGateway()
@Injectable()
export class EventGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private authService: AuthService) {}
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
    const disconnectedUser = jwt.verify(
      socket.handshake.headers.authorization,
      process.env.JWT_SECRET,
    ) as unknown as LoggedUserPayload;

    this.connectedUsers.delete(disconnectedUser.sub);

    console.log(`User disconnected: ${socket.id}`);
  }

  createRecipeEvent(payload: string, userId: number) {
    console.log(this.connectedUsers.size);
    console.log(this.connectedUsers.values);
    const user = this.connectedUsers.get(userId);
    if (user) {
      this.server.to(user).emit('create_recipe_event', payload);
    }
  }
}
