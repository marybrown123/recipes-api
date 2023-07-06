import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateRecipeCommand } from '../../../recipe/commands/impl/createRecipe.command';
import { RecipeDAO } from '../../../recipe/recipe.dao';

@CommandHandler(CreateRecipeCommand)
export class CreateRecipeHandler
  implements ICommandHandler<CreateRecipeCommand>
{
  constructor(private recipeDAO: RecipeDAO) {}
  async execute(command: CreateRecipeCommand) {
    const { recipe, authorId } = command;
    return this.recipeDAO.createRecipe(recipe, authorId);
  }
}
