import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateRecipeDTO } from './DTOs/create-recipe.dto';
import { RecipeService } from './recipe.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { UpdateRecipeDTO } from './DTOs/update-recipe.dto';
import { IsUserAuthorGuard } from 'src/user/guards/is-user-author.guard';
import { IsAdminGuard } from 'src/user/guards/is-admin.guard';

@Controller('/recipe')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createRecipe(@Body() recipe: CreateRecipeDTO, @CurrentUser() user) {
    return await this.recipeService.createRecipe(recipe, user.id);
  }

  @Patch('/:id')
  @UseGuards(AuthGuard('jwt'), IsUserAuthorGuard)
  async updateRecipe(
    @Body() newRecipe: UpdateRecipeDTO,
    @Param('id') recipeId: number,
  ) {
    return this.recipeService.updateRecipe(Number(recipeId), newRecipe);
  }

  @Get('/:id')
  async getOneRecipe(@Param('id') recipeId: number) {
    return this.recipeService.findOneRecipe(Number(recipeId));
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), IsAdminGuard)
  async getAllRecipes(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return await this.recipeService.findAllRecipes(Number(limit), Number(page));
  }
}
