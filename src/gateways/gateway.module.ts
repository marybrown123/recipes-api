import { Module } from '@nestjs/common';
import { NotificationsGateway } from 'src/gateways/notification.gateway';

@Module({
  providers: [NotificationsGateway],
  exports: [NotificationsGateway],
})
export class GatewayModule {}
