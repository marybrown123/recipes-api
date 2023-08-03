import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateRecipeCommand } from '../../../recipe/commands/impl/createRecipe.command';
import { RecipeDAO } from '../../../recipe/recipe.dao';
import { EventGateway } from '../../../websocket/event.gateway';

@CommandHandler(CreateRecipeCommand)
export class CreateRecipeHandler
  implements ICommandHandler<CreateRecipeCommand>
{
  constructor(
    private recipeDAO: RecipeDAO,
    private eventGateway: EventGateway,
  ) {}
  async execute(command: CreateRecipeCommand) {
    const { recipe, authorId } = command;
    const recipeFromDb = this.recipeDAO.createRecipe(recipe, authorId);

    if (recipeFromDb) {
      this.eventGateway.createRecipeEvent(authorId);
    }

    return recipeFromDb;
  }
}
