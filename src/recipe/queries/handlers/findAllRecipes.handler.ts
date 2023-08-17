import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindAllRecipesQuery } from '../../../recipe/queries/impl/findAllRecipes.query';
import { RecipeDAO } from '../../../recipe/recipe.dao';
import { FileService } from 'src/file/file.service';
import { S3Service } from 'src/file/s3.service';
import { RecipeResponse } from 'src/recipe/responses/recipe.response';

@QueryHandler(FindAllRecipesQuery)
export class FindAllRecipesHandler
  implements IQueryHandler<FindAllRecipesQuery>
{
  constructor(
    private recipeDAO: RecipeDAO,
    private fileService: FileService,
    private s3Service: S3Service,
  ) {}

  async execute(query: FindAllRecipesQuery) {
    const { queryData } = query;
    const recipesFromDb = await this.recipeDAO.findAllRecipes(queryData);

    recipesFromDb.map(async (recipe) => {
      const file = await this.fileService.findFileById(recipe.fileId);
      const fileUrl = await this.s3Service.generatePresignedUrl(file.key);

      return new RecipeResponse(recipe, fileUrl);
    });
  }
}
