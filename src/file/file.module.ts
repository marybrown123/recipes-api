import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateFileHandler } from './commands/handlers/create-file.handler';
import { DeleteFileHandler } from './commands/handlers/delete-file.handler';
import { FileController } from './file.controller';
import { FileDAO } from './file.dao';
import { FileService } from './file.service';
import { FindFileByIdHandler } from './queries/handlers/find-file-by-id.handler';
import { S3Service } from './s3.service';
import { PrismaService } from '../prisma/prisma.service';

export const CommandHandlers = [CreateFileHandler, DeleteFileHandler];
export const QueryHandlers = [FindFileByIdHandler];

@Module({
  imports: [CqrsModule],
  providers: [
    FileService,
    S3Service,
    ...CommandHandlers,
    ...QueryHandlers,
    FileDAO,
    PrismaService,
  ],
  exports: [FileService],
  controllers: [FileController],
})
export class FileModule {}
