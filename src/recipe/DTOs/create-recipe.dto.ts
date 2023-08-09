import { IsString, ValidateNested } from 'class-validator';
import { CreatePreparingDTO } from './create-preparation.dto';
import { CreateIngredientDTO } from './create-ingredient.dto';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRecipeDTO {
  @IsString()
  @ApiProperty({ example: 'Dumplings', type: 'string' })
  name: string;

  @IsString()
  @ApiProperty({ example: 'Easy dumplings recipe', type: 'string' })
  description: string;

  @ValidateNested()
  @Type(() => CreatePreparingDTO)
  @ApiProperty({ type: [CreatePreparingDTO], isArray: true })
  preparing: CreatePreparingDTO[];

  @ValidateNested()
  @Type(() => CreateIngredientDTO)
  @ApiProperty({ type: [CreateIngredientDTO], isArray: true })
  ingredients: CreateIngredientDTO[];
}
