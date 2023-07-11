import { CreateRecipeDTO } from '../../../recipe/DTOs/create-recipe.dto';

export class CreateRecipeCommand {
  constructor(
    public readonly recipe: CreateRecipeDTO,
    public readonly authorId: number,
  ) {}
}
