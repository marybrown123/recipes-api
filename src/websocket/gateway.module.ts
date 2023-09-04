import { Module } from '@nestjs/common';
import { EventGateway } from './event.gateway';
import { ConnectionHandlerGateway } from '../websocket/connection.handler.gateway';
import { TokenModule } from 'src/token/token.module';

@Module({
  providers: [EventGateway, ConnectionHandlerGateway],
  exports: [EventGateway],
  imports: [TokenModule],
})
export class GatewayModule {}
