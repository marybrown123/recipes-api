import { UpdateRecipeDTO } from '../../../recipe/DTOs/update-recipe.dto';

export class UpdateRecipeCommand {
  constructor(
    public readonly recipeId: number,
    public readonly newRecipe: UpdateRecipeDTO,
  ) {}
}
