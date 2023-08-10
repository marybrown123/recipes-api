import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
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
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { RecipeResponse } from './responses/recipe.response';
import { User } from '@prisma/client';
import { FindAllRecipesDTO } from './DTOs/find-all-recipes-query';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('/recipe')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Create a new recipe' })
  @ApiCreatedResponse({ type: RecipeResponse })
  @ApiUnauthorizedResponse({ description: 'Not logged in' })
  async createRecipe(
    @Body() recipe: CreateRecipeDTO,
    @CurrentUser() user: User,
  ): Promise<RecipeResponse> {
    return this.recipeService.createRecipe(recipe, user.id);
  }

  @Post('/upload/:id')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AuthGuard('jwt'), IsUserAuthorGuard)
  @ApiOperation({ summary: 'Upload recipe image' })
  @ApiUnauthorizedResponse({ description: 'Not logged in' })
  @ApiForbiddenResponse({
    description: 'User does not own this recipe',
  })
  async uploadRecipeImage(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') recipeId: number,
  ): Promise<RecipeResponse> {
    return this.recipeService.uploadRecipeImage(recipeId, file);
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
  ): Promise<RecipeResponse> {
    return this.recipeService.updateRecipe(Number(recipeId), newRecipe);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get all recipes' })
  @ApiResponse({ type: [RecipeResponse] })
  @ApiUnauthorizedResponse({ description: 'Not logged in' })
  @ApiForbiddenResponse({
    description: 'User is not an admin',
  })
  async getAllRecipes(
    @Query() query: FindAllRecipesDTO,
  ): Promise<RecipeResponse[]> {
    return this.recipeService.findAllRecipes(query);
  }

  @Get('/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get one recipe by id' })
  @ApiResponse({ type: RecipeResponse })
  @ApiParam({ name: 'id', required: true })
  async getOneRecipe(
    @Param('id', ParseIntPipe) recipeId: number,
  ): Promise<RecipeResponse> {
    return this.recipeService.findRecipeById(recipeId);
  }
}
