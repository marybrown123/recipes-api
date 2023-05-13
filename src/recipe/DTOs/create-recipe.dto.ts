import { IsString, ValidateNested } from 'class-validator';
import { CreatePreparingDTO } from './create-preparation.dto';
import { CreateIngredientDTO } from './create-ingredient.dto';
import { Type } from 'class-transformer';

export class CreateRecipeDTO {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  imageURL: string;

  @ValidateNested()
  @Type(() => CreatePreparingDTO)
  preparing: CreatePreparingDTO[];

  @ValidateNested()
  @Type(() => CreateIngredientDTO)
  ingredients: CreateIngredientDTO[];
}
