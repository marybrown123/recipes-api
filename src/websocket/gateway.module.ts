import { Module } from '@nestjs/common';
import { EventGateway } from './event.gateway';
import { AuthModule } from '../auth/auth.module';

@Module({
  providers: [EventGateway],
  exports: [EventGateway],
  imports: [AuthModule],
})
export class GatewayModule {}
