import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateRecipeDTO } from '../../../recipe/DTOs/update-recipe.dto';
import { UploadRecipeImageCommand } from '../../../recipe/commands/impl/uploadRecipeImage.command';
import { FileService } from '../../../recipe/file.service';
import { RecipeDAO } from '../../../recipe/recipe.dao';
import { RecipeResponse } from '../../../recipe/responses/recipe.response';
import { CreateImageDTO } from '../../../recipe/DTOs/create-image.dto';

@CommandHandler(UploadRecipeImageCommand)
export class UploadRecipeImageHandler
  implements ICommandHandler<UploadRecipeImageCommand>
{
  constructor(private recipeDAO: RecipeDAO, private fileService: FileService) {}
  async execute(command: UploadRecipeImageCommand): Promise<RecipeResponse> {
    const { recipeId, file } = command;

    await this.recipeDAO.findRecipeById(recipeId);

    const key = await this.fileService.uploadFileToS3(file);
    const image: CreateImageDTO = {
      name: file.originalname,
      key,
    };
    const recipeWithImage: UpdateRecipeDTO = { image };
    return this.recipeDAO.updateRecipe(recipeId, recipeWithImage);
  }
}
