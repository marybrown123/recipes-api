import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteFileCommand } from '../../commands/impl/delete-file.command';
import { FileDAO } from '../../file.dao';

@CommandHandler(DeleteFileCommand)
export class DeleteFileHandler implements ICommandHandler<DeleteFileCommand> {
  constructor(private fileDAO: FileDAO) {}
  async execute(command: DeleteFileCommand): Promise<void> {
    const { fileId } = command;
    this.fileDAO.deleteFile(fileId);
  }
}
