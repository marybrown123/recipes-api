import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindRecipeByIdQuery } from '../impl/findRecipeById.query';
import { RecipeDAO } from '../../../recipe/recipe.dao';
import { FileService } from '../../../file/file.service';
import { S3Service } from '../../../file/s3.service';
import { RecipeResponse } from '../../responses/recipe.response';

@QueryHandler(FindRecipeByIdQuery)
export class FindRecipeByIdHandler
  implements IQueryHandler<FindRecipeByIdQuery>
{
  constructor(
    private recipeDAO: RecipeDAO,
    private fileService: FileService,
    private s3Service: S3Service,
  ) {}

  async execute(query: FindRecipeByIdQuery) {
    const { recipeId } = query;
    const recipeFromDb = await this.recipeDAO.findRecipeById(recipeId);

    const file = await this.fileService.findFileById(recipeFromDb.fileId);
    const fileUrl = await this.s3Service.generatePresignedUrl(file.key);

    return new RecipeResponse(recipeFromDb, fileUrl);
  }
}
