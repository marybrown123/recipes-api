import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateRecipeCommand } from 'src/recipe/commands/impl/updateRecipe.command';
import { RecipeDAO } from 'src/recipe/recipe.dao';

@CommandHandler(UpdateRecipeCommand)
export class UpdateRecipeHandler
  implements ICommandHandler<UpdateRecipeCommand>
{
  constructor(private recipeDAO: RecipeDAO) {}
  async execute(command: UpdateRecipeCommand) {
    const { recipeId, newRecipe } = command;
    await this.recipeDAO.findRecipeById(recipeId);
    return await this.recipeDAO.updateRecipe(recipeId, newRecipe);
  }
}
