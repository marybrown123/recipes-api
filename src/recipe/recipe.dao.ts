import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RecipeResponse } from '../recipe/responses/recipe.response';
import { CreateRecipeDTO } from 'src/recipe/DTOs/create-recipe.dto';
import { UpdateRecipeDTO } from 'src/recipe/DTOs/update-recipe.dto';
import { FindAllRecipesDTO } from 'src/recipe/DTOs/find-all-recipes-query';

@Injectable()
export class RecipeDAO {
  constructor(private prismaService: PrismaService) {}
  async createRecipe(
    recipe: CreateRecipeDTO,
    authorId: number,
  ): Promise<RecipeResponse> {
    const newRecipe = await this.prismaService.recipe.create({
      data: {
        ...recipe,
        author: {
          connect: {
            id: authorId,
          },
        },
        preparing: { create: recipe.preparing },
        ingredients: { create: recipe.ingredients },
      },
      include: {
        preparing: true,
        ingredients: true,
      },
    });
    return new RecipeResponse(newRecipe);
  }

  async updateRecipe(
    recipeId: number,
    newRecipe: UpdateRecipeDTO,
  ): Promise<RecipeResponse> {
    if (newRecipe.preparing) {
      await this.prismaService.recipePreparationSteps.deleteMany({
        where: {
          recipeId,
        },
      });
    }

    if (newRecipe.ingredients) {
      await this.prismaService.recipeIngredients.deleteMany({
        where: {
          recipeId,
        },
      });
    }
    const updatedRecipe = await this.prismaService.recipe.update({
      where: { id: recipeId },
      data: {
        ...newRecipe,
        preparing: { create: newRecipe.preparing },
        ingredients: { create: newRecipe.ingredients },
      },
      include: {
        preparing: true,
        ingredients: true,
      },
    });

    return new RecipeResponse(updatedRecipe);
  }

  async findRecipeById(recipeId: number): Promise<RecipeResponse> {
    const recipeFromDb = await this.prismaService.recipe.findFirst({
      where: {
        id: recipeId,
      },
      include: {
        preparing: true,
        ingredients: true,
      },
    });

    return new RecipeResponse(recipeFromDb);
  }

  async findAllRecipes(query: FindAllRecipesDTO): Promise<RecipeResponse[]> {
    const whereCodition = query.name ? { name: { contains: query.name } } : {};
    const recipesFromDb = await this.prismaService.recipe.findMany({
      where: whereCodition,
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      include: {
        preparing: true,
        ingredients: true,
      },
    });
    return recipesFromDb.map((recipe) => {
      return new RecipeResponse(recipe);
    });
  }
}
