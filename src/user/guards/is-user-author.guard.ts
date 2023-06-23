import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { RecipeService } from '../../recipe/recipe.service';

@Injectable()
export class IsUserAuthorGuard implements CanActivate {
  constructor(private recipeService: RecipeService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const recipeFromDb = await this.recipeService.findRecipeById(
      Number(request.params.id),
    );

    if (request.user.id !== recipeFromDb.authorId) {
      return false;
    }

    return true;
  }
}
