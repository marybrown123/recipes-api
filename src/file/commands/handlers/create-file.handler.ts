import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateFileCommand } from '../../commands/impl/create-file.command';
import { FileDAO } from '../../file.dao';
import { FileResponse } from '../../responses/file.response';
import { S3Service } from '../../s3.service';
import { CreateFileDTO } from 'src/file/DTOs/create-file.dto';

@CommandHandler(CreateFileCommand)
export class CreateFileHandler implements ICommandHandler<CreateFileCommand> {
  constructor(private fileDAO: FileDAO, private s3Service: S3Service) {}
  async execute(command: CreateFileCommand): Promise<FileResponse> {
    const { fileName } = command;
    const fileKey = this.s3Service.generateKey(fileName);
    const fileForDb: CreateFileDTO = {
      name: fileName,
      key: fileKey,
    };
    const fileFromDb = await this.fileDAO.createFile(fileForDb);
    return new FileResponse(fileFromDb);
  }
}
