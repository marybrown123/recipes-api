import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { UserService } from './user/user.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const userService: UserService = app.get<UserService>(UserService);
  userService.generateAdnimAccount();
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
