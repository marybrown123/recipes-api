import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { FileService } from '../../../file/file.service';
import { DeleteRecipeCommand } from '../impl/deleteRecipe.command';
import { RecipeDAO } from '../../recipe.dao';
import { RecipeResponse } from '../../responses/recipe.response';
import { WebhookService } from '../../../webhook/webhook.service';

@CommandHandler(DeleteRecipeCommand)
export class DeleteRecipeHandler
  implements ICommandHandler<DeleteRecipeCommand>
{
  constructor(
    private readonly recipeDAO: RecipeDAO,
    private readonly fileService: FileService,
    private readonly webhookService: WebhookService,
  ) {}
  async execute(command: DeleteRecipeCommand) {
    const { recipeId } = command;
    const recipeToDelete = await this.recipeDAO.findRecipeById(recipeId);
    await Promise.all([
      this.recipeDAO.deleteRecipe(recipeId),
      this.fileService.deleteFile(recipeToDelete.fileId),
    ]);

    const recipeForWebhook = new RecipeResponse(recipeToDelete);
    await this.webhookService.sendRecipeDeletedWebhook(recipeForWebhook);
  }
}
