import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRecipeDTO } from './DTOs/create-recipe.dto';
import { RecipeResponse } from './responses/recipe.response';

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
}
