import { Injectable } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io-client';
import { TokenService } from 'src/token/token.service';

@WebSocketGateway()
@Injectable()
export class ConnectionHandlerGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private tokenService: TokenService) {}
  public connectedUsers = new Map<number, string>();

  async handleConnection(socket: Socket) {
    try {
      const connectedUser = await this.tokenService.verifyAuthenticationToken(
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
      const disconnectedUser =
        await this.tokenService.verifyAuthenticationToken(
          socket.handshake.headers.authorization,
        );

      this.connectedUsers.delete(disconnectedUser.sub);
    } catch (error) {
      socket.disconnect();
      return error;
    }
  }
}
