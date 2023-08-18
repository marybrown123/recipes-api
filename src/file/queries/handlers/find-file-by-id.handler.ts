import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FileDAO } from '../../file.dao';
import { FindFileByIdQuery } from '../../queries/impl/find-file-by-id.command';
import { FileResponse } from '../../responses/file.response';

@QueryHandler(FindFileByIdQuery)
export class FindFileByIdHandler implements IQueryHandler<FindFileByIdQuery> {
  constructor(private fileDAO: FileDAO) {}
  async execute(command: FindFileByIdQuery): Promise<FileResponse> {
    const { fileId } = command;
    const fileFromDb = await this.fileDAO.findFileById(fileId);
    return new FileResponse(fileFromDb);
  }
}
