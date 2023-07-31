import { Module } from '@nestjs/common';
import { NotificationsGateway } from './../gateways/notification.gateway';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [NotificationsGateway],
  exports: [NotificationsGateway],
  imports: [AuthModule],
})
export class GatewayModule {}
