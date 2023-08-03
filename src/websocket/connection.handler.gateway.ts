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
      );

      this.connectedUsers.set(connectedUser.sub, socket.id);
    } catch (error) {
      socket.disconnect();
      return error;
    }
  }

  async handleDisconnect(socket: Socket) {
    try {
      const disconnectedUser = await this.authService.verifyToken(
        socket.handshake.headers.authorization,
      );

      this.connectedUsers.delete(disconnectedUser.sub);
    } catch (error) {
      socket.disconnect();
      return error;
    }
  }
}
