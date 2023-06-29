import { CreateRecipeDTO } from 'src/recipe/DTOs/create-recipe.dto';

export class CreateRecipeCommand {
  constructor(
    public readonly recipe: CreateRecipeDTO,
    public readonly authorId: number,
  ) {}
}
