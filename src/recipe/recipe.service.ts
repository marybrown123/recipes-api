import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRecipeDTO } from './DTOs/create-recipe.dto';
import { RecipeResponse } from './responses/recipe.response';
import { UpdateRecipeDTO } from './DTOs/update-recipe.dto';

@Injectable()
export class RecipeService {
  constructor(private prisma: PrismaService) {}

  async createRecipe(recipe: CreateRecipeDTO, authorId: number) {
    const newRecipe = await this.prisma.recipe.create({
      data: {
        name: recipe.name,
        description: recipe.description,
        imageURL: recipe.imageURL,
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

  async updateRecipe(recipeId: number, newRecipe: UpdateRecipeDTO) {
    const recipeToUpdate = await this.prisma.recipe.findUnique({
      where: {
        id: recipeId,
      },
    });

    if (!recipeToUpdate) {
      throw new HttpException(
        'There is no recipe with this is',
        HttpStatus.NOT_FOUND,
      );
    }

    if (newRecipe.preparing) {
      await this.prisma.recipePreparationSteps.deleteMany({
        where: {
          recipeId,
        },
      });
    }

    if (newRecipe.ingredients) {
      await this.prisma.recipeIngredients.deleteMany({
        where: {
          recipeId,
        },
      });
    }

    const updatedRecipe = await this.prisma.recipe.update({
      where: { id: recipeId },
      data: {
        name: newRecipe.name,
        description: newRecipe.description,
        imageURL: newRecipe.imageURL,
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

  async findOneRecipe(recipeId: number) {
    const recipeFromDb = await this.prisma.recipe.findUnique({
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
}
