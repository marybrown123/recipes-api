import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindRecipeByIdQuery } from '../impl/findRecipeById.query';
import { RecipeResponse } from 'src/recipe/responses/recipe.response';
import { RecipeDAO } from 'src/recipe/recipe.dao';

@QueryHandler(FindRecipeByIdQuery)
export class FindRecipeByIdHandler
  implements IQueryHandler<FindRecipeByIdQuery>
{
  constructor(private recipeDAO: RecipeDAO) {}

  async execute(query: FindRecipeByIdQuery) {
    const { recipeId } = query;
    const recipeFromDb = await this.recipeDAO.findRecipeById(recipeId);

    if (!recipeFromDb) {
      throw new NotFoundException();
    }

    return recipeFromDb;
  }
}
