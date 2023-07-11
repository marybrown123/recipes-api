import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateRecipeCommand } from '../../../recipe/commands/impl/updateRecipe.command';
import { RecipeDAO } from '../../../recipe/recipe.dao';

@CommandHandler(UpdateRecipeCommand)
export class UpdateRecipeHandler
  implements ICommandHandler<UpdateRecipeCommand>
{
  constructor(private recipeDAO: RecipeDAO) {}
  async execute(command: UpdateRecipeCommand) {
    const { recipeId, newRecipe } = command;
    const recipeFromDb = await this.recipeDAO.findRecipeById(recipeId);

    if (!recipeFromDb) {
      throw new NotFoundException();
    }

    return this.recipeDAO.updateRecipe(recipeId, newRecipe);
  }
}
