import { FindAllRecipesDTO } from 'src/recipe/DTOs/find-all-recipes-query';

export class FindAllRecipesQuery {
  constructor(public queryData: FindAllRecipesDTO) {}
}
