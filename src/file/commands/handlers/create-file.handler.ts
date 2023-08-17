import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateFileCommand } from '../../commands/impl/create-file.command';
import { FileDAO } from '../../file.dao';
import { FileResponse } from '../../responses/file.response';

@CommandHandler(CreateFileCommand)
export class CreateFileHandler implements ICommandHandler<CreateFileCommand> {
  constructor(private fileDAO: FileDAO) {}
  async execute(command: CreateFileCommand): Promise<FileResponse> {
    const { file } = command;
    const fileFromDb = await this.fileDAO.createFile(file);
    return new FileResponse(fileFromDb);
  }
}
