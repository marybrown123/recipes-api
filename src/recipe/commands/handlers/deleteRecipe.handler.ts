import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { FileService } from 'src/file/file.service';
import { DeleteRecipeCommand } from 'src/recipe/commands/impl/deleteRecipe.command';
import { RecipeDAO } from 'src/recipe/recipe.dao';

@CommandHandler(DeleteRecipeCommand)
export class DeleteRecipeHandler
  implements ICommandHandler<DeleteRecipeCommand>
{
  constructor(
    private readonly recipeDAO: RecipeDAO,
    private readonly fileService: FileService,
  ) {}
  async execute(command: DeleteRecipeCommand) {
    const { recipeId } = command;
    const recipeToDelete = await this.recipeDAO.findRecipeById(recipeId);
    await this.recipeDAO.deleteRecipe(recipeId);
    await this.fileService.deleteFile(recipeToDelete.fileId);
  }
}
