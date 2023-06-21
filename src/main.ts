import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { UserService } from './user/user.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Role } from '@prisma/client';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const userService: UserService = app.get<UserService>(UserService);
  userService.generateAccount(
    process.env.ADMIN_NAME,
    process.env.ADMIN_PASSWORD,
    Role.ADMIN,
  );
  userService.generateAccount(
    process.env.TEST_NAME,
    process.env.TEST_PASSWORD,
    Role.USER,
  );

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const config = new DocumentBuilder()
    .setTitle('Recipes API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
