import { IsString, ValidateNested } from 'class-validator';
import { CreateIngredientDTO } from './create-ingredient.dto';
import { CreatePreparingDTO } from './create-preparation.dto';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRecipeDTO {
  @IsString()
  @ApiProperty({ example: 'Dumplings' })
  name?: string;

  @IsString()
  @ApiProperty({ example: 'Easy dumplings recipe' })
  description?: string;

  @IsString()
  @ApiProperty({ example: 'imageURL' })
  imageURL?: string;

  @ValidateNested()
  @Type(() => CreatePreparingDTO)
  @ApiProperty({ type: [CreatePreparingDTO] })
  preparing?: CreatePreparingDTO[];

  @ValidateNested()
  @Type(() => CreateIngredientDTO)
  @ApiProperty({ type: [CreateIngredientDTO] })
  ingredients?: CreateIngredientDTO[];
}
