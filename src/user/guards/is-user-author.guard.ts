import {
  CanActivate,
  ExecutionContext,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { RecipeService } from 'src/recipe/recipe.service';

@Injectable()
export class IsUserAuthorGuard implements CanActivate {
  constructor(private recipeService: RecipeService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const recipeFromDb = await this.recipeService.findRecipeById(
      Number(request.params.id),
    );

    if (request.user.id !== recipeFromDb.authorId) {
      throw new HttpException(
        'User do not own this recipe',
        HttpStatus.FORBIDDEN,
      );
    }

    return true;
  }
}
