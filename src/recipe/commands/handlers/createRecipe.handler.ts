import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateRecipeCommand } from 'src/recipe/commands/impl/createRecipe.command';
import { RecipeDAO } from 'src/recipe/recipe.dao';

@CommandHandler(CreateRecipeCommand)
export class CreateRecipeHandler
  implements ICommandHandler<CreateRecipeCommand>
{
  constructor(private recipeDAO: RecipeDAO) {}
  async execute(command: CreateRecipeCommand) {
    const { recipe, authorId } = command;
    return await this.recipeDAO.createRecipe(recipe, authorId);
  }
}
