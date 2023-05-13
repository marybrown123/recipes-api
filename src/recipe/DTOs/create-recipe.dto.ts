import { IsString, ValidateNested } from 'class-validator';
import { CreatePreparingDTO } from './create-preparation.dto';
import { CreateIngredientDTO } from './create-ingredient.dto';

export class CreateRecipeDTO {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  imageURL: string;

  @ValidateNested()
  preparing: CreatePreparingDTO[];

  @ValidateNested()
  ingredients: CreateIngredientDTO[];
}
