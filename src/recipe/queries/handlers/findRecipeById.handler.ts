import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindRecipeByIdQuery } from '../impl/findRecipeById.query';
import { RecipeDAO } from 'src/recipe/recipe.dao';

@QueryHandler(FindRecipeByIdQuery)
export class FindRecipeByIdHandler
  implements IQueryHandler<FindRecipeByIdQuery>
{
  constructor(private recipeDAO: RecipeDAO) {}

  async execute(query: FindRecipeByIdQuery) {
    const { recipeId } = query;
    return await this.recipeDAO.findRecipeById(recipeId);
  }
}
