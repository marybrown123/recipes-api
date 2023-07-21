import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { RecipeModule } from './recipe/recipe.module';
import { ConfigModule } from '@nestjs/config';
import { GatewayModule } from 'src/gateways/gateway.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    RecipeModule,
    ConfigModule.forRoot(),
    GatewayModule,
  ],
})
export class AppModule {}
