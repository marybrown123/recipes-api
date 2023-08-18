import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteFileCommand } from '../../commands/impl/delete-file.command';
import { FileDAO } from '../../file.dao';
import { S3Service } from '../../s3.service';

@CommandHandler(DeleteFileCommand)
export class DeleteFileHandler implements ICommandHandler<DeleteFileCommand> {
  constructor(private fileDAO: FileDAO, private s3Service: S3Service) {}
  async execute(command: DeleteFileCommand): Promise<void> {
    const { fileId } = command;
    const fileToDelete = await this.fileDAO.findFileById(fileId);
    await this.s3Service.deleteFile(fileToDelete.key);
    await this.fileDAO.deleteFile(fileId);
  }
}
