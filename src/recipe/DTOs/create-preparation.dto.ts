import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreatePreparingDTO {
  @IsString()
  @ApiProperty({ example: 'Add flour', type: 'string' })
  step: string;

  @IsNumber()
  @ApiProperty({ example: 1, type: 'number' })
  order: number;
}
