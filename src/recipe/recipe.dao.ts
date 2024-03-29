import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRecipeDTO } from './DTOs/create-recipe.dto';
import { UpdateRecipeDTO } from './DTOs/update-recipe.dto';
import { FindAllRecipesDTO } from './DTOs/find-all-recipes-query';
import { CompleteRecipe } from 'src/recipe/types/complete-recipe.type';

@Injectable()
export class RecipeDAO {
  constructor(private prismaService: PrismaService) {}
  async createRecipe(
    recipe: CreateRecipeDTO,
    authorId: number,
  ): Promise<CompleteRecipe> {
    return this.prismaService.recipe.create({
      data: {
        name: recipe.name,
        description: recipe.description,
        file: {
          connect: {
            id: recipe.fileId,
          },
        },
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
  }

  async updateRecipe(
    recipeId: number,
    newRecipe: UpdateRecipeDTO,
  ): Promise<CompleteRecipe> {
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
    return this.prismaService.recipe.update({
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
  }

  async findRecipeById(recipeId: number): Promise<CompleteRecipe> {
    const recipeFromDb = await this.prismaService.recipe.findFirst({
      where: {
        id: recipeId,
      },
      include: {
        preparing: true,
        ingredients: true,
      },
    });

    if (!recipeFromDb) {
      throw new NotFoundException();
    }

    return recipeFromDb;
  }

  async findAllRecipes(query: FindAllRecipesDTO): Promise<CompleteRecipe[]> {
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
    return recipesFromDb;
  }
}
