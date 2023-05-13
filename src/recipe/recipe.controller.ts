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
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { RecipeResponse } from './responses/recipe.response';

@Controller('/recipe')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Create a new recipe' })
  @ApiCreatedResponse({ type: RecipeResponse })
  @ApiUnauthorizedResponse({ description: 'Not logged in' })
  async createRecipe(@Body() recipe: CreateRecipeDTO, @CurrentUser() user) {
    return await this.recipeService.createRecipe(recipe, user.id);
  }

  @Patch('/:id')
  @UseGuards(AuthGuard('jwt'), IsUserAuthorGuard)
  @ApiOperation({ summary: 'Update a recipe' })
  @ApiCreatedResponse({ type: RecipeResponse })
  @ApiUnauthorizedResponse({ description: 'Not logged in' })
  @ApiForbiddenResponse({
    description: 'User does not own this recipe',
  })
  @ApiParam({ name: 'id', required: true })
  async updateRecipe(
    @Body() newRecipe: UpdateRecipeDTO,
    @Param('id') recipeId: number,
  ) {
    return await this.recipeService.updateRecipe(Number(recipeId), newRecipe);
  }

  @Get('/byId/:id')
  @ApiOperation({ summary: 'Get one recipe by id' })
  @ApiResponse({ type: RecipeResponse })
  @ApiParam({ name: 'id', required: true })
  async getOneRecipe(@Param('id') recipeId: number) {
    return await this.recipeService.findOneRecipe(Number(recipeId));
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), IsAdminGuard)
  @ApiOperation({ summary: 'Get all recipes' })
  @ApiResponse({ type: [RecipeResponse] })
  @ApiUnauthorizedResponse({ description: 'Not logged in' })
  @ApiForbiddenResponse({
    description: 'User is not an admin',
  })
  async getAllRecipes(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return await this.recipeService.findAllRecipes(Number(limit), Number(page));
  }

  @Get('/byName')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get a recipe by name' })
  @ApiResponse({ type: [RecipeResponse] })
  @ApiUnauthorizedResponse({ description: 'Not logged in' })
  async getRecipeByName(@Query('query') query: string) {
    return await this.recipeService.findRecipeByName(query);
  }
}
