import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateRecipeCommand } from '../../../recipe/commands/impl/updateRecipe.command';
import { RecipeDAO } from '../../../recipe/recipe.dao';
import { FileService } from '../../../file/file.service';
import { S3Service } from '../../../file/s3.service';
import { RecipeResponse } from 'src/recipe/responses/recipe.response';

@CommandHandler(UpdateRecipeCommand)
export class UpdateRecipeHandler
  implements ICommandHandler<UpdateRecipeCommand>
{
  constructor(
    private recipeDAO: RecipeDAO,
    private fileService: FileService,
    private s3Service: S3Service,
  ) {}
  async execute(command: UpdateRecipeCommand) {
    const { recipeId, newRecipe } = command;
    const recipeFromDb = await this.recipeDAO.findRecipeById(recipeId);

    if (!recipeFromDb) {
      throw new NotFoundException();
    }

    if (newRecipe.fileId) {
      const oldFile = await this.fileService.findFileById(recipeFromDb.fileId);
      const fileKey = oldFile.key;
      await this.s3Service.deleteFile(fileKey);
      return await this.fileService.deleteFile(oldFile.id);
    }

    const updatedRecipe = await this.recipeDAO.updateRecipe(
      recipeId,
      newRecipe,
    );

    const file = await this.fileService.findFileById(updatedRecipe.fileId);
    const fileUrl = await this.s3Service.generatePresignedUrl(file.key);

    return new RecipeResponse(updatedRecipe, fileUrl);
  }
}
