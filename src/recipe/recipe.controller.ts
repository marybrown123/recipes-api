import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateRecipeDTO } from './DTOs/create-recipe.dto';
import { RecipeService } from './recipe.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/common/decorators/user.decorator';

@Controller('/recipe')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('/add')
  async createRecipe(@Body() recipe: CreateRecipeDTO, @CurrentUser() user) {
    return await this.recipeService.createRecipe(recipe, user.id);
  }
}
