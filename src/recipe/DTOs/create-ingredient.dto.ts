import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateIngredientDTO {
  @IsString()
  @ApiProperty({ example: 'flour', type: 'string' })
  name: string;

  @IsString()
  @ApiProperty({ example: 'three spoons', type: 'string' })
  amount: string;
}
