import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { FileService } from '../../../file/file.service';
import { DeleteRecipeCommand } from '../impl/deleteRecipe.command';
import { RecipeDAO } from '../../recipe.dao';
import { WebhookName } from '../../../webhook/enums/webhookName.enum';
import { WebhookEventHandler } from '../../../webhook/webhook-event.handler';

@CommandHandler(DeleteRecipeCommand)
export class DeleteRecipeHandler
  implements ICommandHandler<DeleteRecipeCommand>
{
  constructor(
    private readonly recipeDAO: RecipeDAO,
    private readonly fileService: FileService,
    private readonly webhookEventHandler: WebhookEventHandler,
  ) {}
  async execute(command: DeleteRecipeCommand) {
    const { recipeId } = command;
    const recipeToDelete = await this.recipeDAO.findRecipeById(recipeId);
    await Promise.all([
      this.recipeDAO.deleteRecipe(recipeId),
      this.fileService.deleteFile(recipeToDelete.fileId),
    ]);

    await this.webhookEventHandler.createWebhookEvent(
      WebhookName.RecipeDeletedWebhook,
      recipeToDelete,
    );
  }
}
