import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteFileCommand } from '../../commands/impl/delete-file.command';
import { FileDAO } from '../../file.dao';
import { FileResponse } from '../../responses/file.response';

@CommandHandler(DeleteFileCommand)
export class DeleteFileHandler implements ICommandHandler<DeleteFileCommand> {
  constructor(private fileDAO: FileDAO) {}
  async execute(command: DeleteFileCommand): Promise<FileResponse> {
    const { fileId } = command;
    return this.fileDAO.deleteFile(fileId);
  }
}
