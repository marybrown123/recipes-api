import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateIngredientDTO {
  @IsString()
  @ApiProperty({ example: 'flour' })
  name: string;

  @IsString()
  @ApiProperty({ example: 'three spoons' })
  amount: string;
}
