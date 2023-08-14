import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateFileDTO } from './DTOs/create-file.dto';
import { CreateFileCommand } from './commands/impl/create-file.command';
import { DeleteFileCommand } from './commands/impl/delete-file.command';
import { FindFileByIdQuery } from './queries/impl/find-file-by-id.command';
import { FileResponse } from './responses/file.response';

@Injectable()
export class FileService {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

  async createFile(file: CreateFileDTO): Promise<FileResponse> {
    return this.commandBus.execute(new CreateFileCommand(file));
  }

  async deleteFile(fileId: number): Promise<FileResponse> {
    return this.commandBus.execute(new DeleteFileCommand(fileId));
  }

  async findFileById(fileId: number): Promise<FileResponse> {
    return this.queryBus.execute(new FindFileByIdQuery(fileId));
  }
}
