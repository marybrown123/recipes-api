import { Injectable } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ConnectionHandlerGateway } from 'src/websocket/connection.handler.gateway';

@WebSocketGateway()
@Injectable()
export class EventGateway {
  constructor(private connectionHandlerGateway: ConnectionHandlerGateway) {}
  @WebSocketServer()
  server: Server;

  createRecipeEvent(userId: number) {
    const user = this.connectionHandlerGateway.connectedUsers.get(userId);
    if (user) {
      this.server
        .to(user)
        .emit('create_recipe_event', 'Recipe created succesfully');
    }
  }
}
