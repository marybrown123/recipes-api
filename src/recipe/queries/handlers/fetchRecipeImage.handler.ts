import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FileService } from '../../../recipe/file.service';
import { FetchRecipeImageQuery } from '../../../recipe/queries/impl/fetchRecipeImage.query';
import { RecipeDAO } from '../../../recipe/recipe.dao';

@QueryHandler(FetchRecipeImageQuery)
export class FetchRecipeImageHandler
  implements IQueryHandler<FetchRecipeImageQuery>
{
  constructor(private recipeDAO: RecipeDAO, private fileService: FileService) {}

  async execute(query: FetchRecipeImageQuery) {
    const { recipeId } = query;
    const recipeFromDb = await this.recipeDAO.findRecipeById(recipeId);
    const recipeImageKey = recipeFromDb.imageKey;
    return this.fileService.fetchFileFromS3(recipeImageKey);
  }
}
