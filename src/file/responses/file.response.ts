import { ApiProperty } from '@nestjs/swagger';
import { File } from '@prisma/client';

export class FileResponse {
  constructor(file: File) {
    this.id = file.id;
    this.name = file.name;
    this.key = file.key;
  }
  @ApiProperty({ example: 1, type: 'number' })
  id: number;

  @ApiProperty({ example: 'name.jpg', type: 'string' })
  name: string;

  @ApiProperty({ example: '12345-name.jpg', type: 'string' })
  key: string;
}
