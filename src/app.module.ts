import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { RecipeModule } from './recipe/recipe.module';
import { ConfigModule } from '@nestjs/config';
import { GatewayModule } from './websocket/gateway.module';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { FileModule } from './file/file.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    RecipeModule,
    FileModule,
    ConfigModule.forRoot({ isGlobal: true }),
    GatewayModule,
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      ttl: parseInt(process.env.TTL_IN_SECONDS, 10),
    }),
  ],
})
export class AppModule {}
