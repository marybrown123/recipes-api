import { CreateFileDTO } from '../../DTOs/create-file.dto';

export class CreateFileCommand {
  constructor(public readonly file: CreateFileDTO) {}
}
