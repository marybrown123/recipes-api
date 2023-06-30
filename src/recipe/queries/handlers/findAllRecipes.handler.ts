import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindAllRecipesQuery } from 'src/recipe/queries/impl/findAllRecipes.query';
import { RecipeDAO } from 'src/recipe/recipe.dao';

@QueryHandler(FindAllRecipesQuery)
export class FindAllRecipesHandler
  implements IQueryHandler<FindAllRecipesQuery>
{
  constructor(private recipeDAO: RecipeDAO) {}

  async execute(query: FindAllRecipesQuery) {
    const { queryData } = query;
    return this.recipeDAO.findAllRecipes(queryData);
  }
}
