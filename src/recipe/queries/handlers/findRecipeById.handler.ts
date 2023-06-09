import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindRecipeByIdQuery } from '../impl/findRecipeById.query';
import { RecipeDAO } from '../../../recipe/recipe.dao';

@QueryHandler(FindRecipeByIdQuery)
export class FindRecipeByIdHandler
  implements IQueryHandler<FindRecipeByIdQuery>
{
  constructor(private recipeDAO: RecipeDAO) {}

  async execute(query: FindRecipeByIdQuery) {
    const { recipeId } = query;
    return this.recipeDAO.findRecipeById(recipeId);
  }
}
