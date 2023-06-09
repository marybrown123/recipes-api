import { IsString, ValidateNested } from 'class-validator';
import { CreateIngredientDTO } from './create-ingredient.dto';
import { CreatePreparingDTO } from './create-preparation.dto';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRecipeDTO {
  @IsString()
  @ApiProperty({ example: 'Dumplings', type: 'string' })
  name?: string;

  @IsString()
  @ApiProperty({ example: 'Easy dumplings recipe', type: 'string' })
  description?: string;

  @IsString()
  @ApiProperty({ example: 'imageURL', type: 'string' })
  imageURL?: string;

  @ValidateNested()
  @Type(() => CreatePreparingDTO)
  @ApiProperty({ type: [CreatePreparingDTO], isArray: true })
  preparing?: CreatePreparingDTO[];

  @ValidateNested()
  @Type(() => CreateIngredientDTO)
  @ApiProperty({ type: [CreateIngredientDTO], isArray: true })
  ingredients?: CreateIngredientDTO[];
}
