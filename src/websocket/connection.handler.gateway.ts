import { Injectable } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io-client';
import { AuthService } from '../auth/auth.service';

@WebSocketGateway()
@Injectable()
export class ConnectionHandlerGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private authService: AuthService) {}
  public connectedUsers = new Map<number, string>();

  async handleConnection(socket: Socket) {
    try {
      const connectedUser = await this.authService.verifyToken(
        socket.handshake.headers.authorization,
        process.env.JWT_SECRET,
      );

      this.connectedUsers.set(connectedUser.sub, socket.id);

      console.log(`User connected: ${socket.id}`);
    } catch (error) {
      console.error(error.message);
    }
  }

  async handleDisconnect(socket: Socket) {
    try {
      const disconnectedUser = await this.authService.verifyToken(
        socket.handshake.headers.authorization,
        process.env.JWT_SECRET,
      );

      this.connectedUsers.delete(disconnectedUser.sub);

      console.log(`User disconnected: ${socket.id}`);
    } catch (error) {
      console.error(error.message);
    }
  }
}
