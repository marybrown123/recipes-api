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
    const oldImageUrl = recipeFromDb.imageURL;
    if (oldImageUrl !== null) {
      return 'Recipe already has an image';
    }

    const imageURL = await this.fileService.uploadFileToS3(file);
    const recipeWithImage: UpdateRecipeDTO = { imageURL };
    return this.recipeDAO.updateRecipe(recipeId, recipeWithImage);
  }
}
