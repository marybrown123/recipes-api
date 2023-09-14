import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateRecipeDTO } from './DTOs/create-recipe.dto';
import { RecipeService } from './recipe.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../common/decorators/user.decorator';
import { UpdateRecipeDTO } from './DTOs/update-recipe.dto';
import { IsUserAuthorGuard } from '../user/guards/is-user-author.guard';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { RecipeResponse } from './responses/recipe.response';
import { User } from '@prisma/client';
import { FindAllRecipesDTO } from './DTOs/find-all-recipes-query';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('recipe')
@Controller('/recipe')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Create a new recipe' })
  @ApiCreatedResponse({ type: RecipeResponse })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiUnauthorizedResponse({ description: 'User not authorized' })
  async createRecipe(
    @Body() recipe: CreateRecipeDTO,
    @CurrentUser() user: User,
  ): Promise<RecipeResponse> {
    return this.recipeService.createRecipe(recipe, user.id);
  }

  @Patch('/:id')
  @UseGuards(AuthGuard('jwt'), IsUserAuthorGuard)
  @ApiOperation({ summary: 'Update a recipe' })
  @ApiCreatedResponse({ type: RecipeResponse })
  @ApiUnauthorizedResponse({ description: 'User not authorized' })
  @ApiForbiddenResponse({
    description: 'User does not own this recipe',
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiParam({ name: 'id', required: true })
  async updateRecipe(
    @Body() newRecipe: UpdateRecipeDTO,
    @Param('id') recipeId: number,
  ): Promise<RecipeResponse> {
    return this.recipeService.updateRecipe(Number(recipeId), newRecipe);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get all recipes' })
  @ApiResponse({ type: [RecipeResponse] })
  @ApiUnauthorizedResponse({ description: 'User not authorized' })
  async getAllRecipes(
    @Query() query: FindAllRecipesDTO,
  ): Promise<RecipeResponse[]> {
    return this.recipeService.findAllRecipes(query);
  }

  @Get('/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get one recipe by id' })
  @ApiUnauthorizedResponse({ description: 'User not authorized' })
  @ApiResponse({ type: RecipeResponse })
  @ApiParam({ name: 'id', required: true })
  async getOneRecipe(
    @Param('id', ParseIntPipe) recipeId: number,
  ): Promise<RecipeResponse> {
    return this.recipeService.findRecipeById(recipeId);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard('jwt'), IsUserAuthorGuard)
  @ApiOperation({ summary: 'Delete one recipe by id' })
  @ApiUnauthorizedResponse({ description: 'User not authorized' })
  @ApiForbiddenResponse({
    description: 'User does not own this recipe',
  })
  @ApiParam({ name: 'id', required: true })
  async deleteRecipe(@Param('id') recipeId: number) {
    await this.recipeService.deleteRecipe(recipeId);
  }
}
