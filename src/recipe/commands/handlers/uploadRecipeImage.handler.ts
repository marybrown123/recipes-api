import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateRecipeDTO } from '../../../recipe/DTOs/update-recipe.dto';
import { UploadRecipeImageCommand } from '../../../recipe/commands/impl/uploadRecipeImage.command';
import { FileService } from '../../../recipe/file.service';
import { RecipeDAO } from '../../../recipe/recipe.dao';

@CommandHandler(UploadRecipeImageCommand)
export class UploadRecipeImageHandler
  implements ICommandHandler<UploadRecipeImageCommand>
{
  constructor(private recipeDAO: RecipeDAO, private fileService: FileService) {}
  async execute(command: UploadRecipeImageCommand) {
    const { recipeId, file } = command;

    const recipeFromDb = await this.recipeDAO.findRecipeById(recipeId);
    const oldImageKey = recipeFromDb.imageKey;
    if (oldImageKey !== null) {
      return 'Recipe already has an image';
    }

    const key = this.fileService.generateS3Key(file.originalname);
    await this.fileService.uploadFileToS3(file, key);
    const recipeWithImage: UpdateRecipeDTO = { imageKey: key };
    return this.recipeDAO.updateRecipe(recipeId, recipeWithImage);
  }
}
