import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RecipeResponse } from '../recipe/responses/recipe.response';

@Injectable()
export class RecipeDAO {
  constructor(private prismaService: PrismaService) {}
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
}
