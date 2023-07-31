import { Module } from '@nestjs/common';
import { EventGateway } from './event.gateway';
import { AuthModule } from '../auth/auth.module';
import { ConnectionHandlerGateway } from 'src/websocket/connection.handler.gateway';

@Module({
  providers: [EventGateway, ConnectionHandlerGateway],
  exports: [EventGateway],
  imports: [AuthModule],
})
export class GatewayModule {}
