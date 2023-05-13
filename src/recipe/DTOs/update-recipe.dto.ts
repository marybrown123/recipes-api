import { IsString } from 'class-validator';
import { CreateIngredientDTO } from './create-ingredient.dto';
import { CreatePreparingDTO } from './create-preparation.dto';

export class UpdateRecipeDTO {
  @IsString()
  name?: string;
  @IsString()
  description?: string;
  @IsString()
  imageURL?: string;
  preparing?: CreatePreparingDTO[];
  ingredients?: CreateIngredientDTO[];
}
