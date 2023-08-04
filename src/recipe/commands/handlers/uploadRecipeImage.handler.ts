import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateRecipeDTO } from 'src/recipe/DTOs/update-recipe.dto';
import { UploadRecipeImageCommand } from 'src/recipe/commands/impl/uploadRecipeImage.command';
import { FileService } from 'src/recipe/file.service';
import { RecipeDAO } from 'src/recipe/recipe.dao';

@CommandHandler(UploadRecipeImageCommand)
export class UploadRecipeImageHandler
  implements ICommandHandler<UploadRecipeImageCommand>
{
  constructor(private recipeDAO: RecipeDAO, private fileService: FileService) {}
  async execute(command: UploadRecipeImageCommand) {
    const { recipeId, file } = command;

    await this.recipeDAO.findRecipeById(recipeId);

    const imageURL = await this.fileService.uploadFileToS3(
      file.originalname,
      file.buffer,
    );

    const recipeWithImage: UpdateRecipeDTO = { imageURL };

    return this.recipeDAO.updateRecipe(recipeId, recipeWithImage);
  }
}
