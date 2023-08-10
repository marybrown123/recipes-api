import { ApiProperty } from '@nestjs/swagger';
import { Image } from '@prisma/client';

export class ImageResponse implements Image {
  constructor(image: Image) {
    this.id = image.id;
    this.name = image.name;
    this.key = image.key;
    this.recipeId = image.recipeId;
  }
  @ApiProperty({ example: 1, type: 'number' })
  id: number;
  @ApiProperty({ example: 'dumplings.jps', type: 'string' })
  name: string;
  @ApiProperty({ example: 'asdfg.dumplings.jpg', type: 'string' })
  key: string;
  @ApiProperty({ example: 1, type: 'number' })
  recipeId: number;
}
