import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreatePreparingDTO {
  @IsString()
  @ApiProperty({ example: 'Add flour' })
  step: string;

  @IsNumber()
  @ApiProperty({ example: 1 })
  order: number;
}
