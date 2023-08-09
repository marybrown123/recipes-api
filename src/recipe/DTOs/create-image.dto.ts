import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateImageDTO {
  @IsString()
  @ApiProperty({ example: 'dumplings.jpg', type: 'string' })
  name: string;

  @IsString()
  @ApiProperty({ example: 'abcdefg12345.dumplings.jpg', type: 'string' })
  key: string;
}
