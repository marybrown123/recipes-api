import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindRecipeByIdQuery } from '../../../recipe/queries/find-recipe-by-id.query';
import { PrismaService } from 'src/prisma/prisma.service';

@QueryHandler(FindRecipeByIdQuery)
export class FindRecipeByIdHandler
  implements IQueryHandler<FindRecipeByIdQuery>
{
  constructor(private prisma: PrismaService) {}

  async execute(query: FindRecipeByIdQuery) {
    const { recipeId } = query;
    const recipeFromDb = await this.prisma.recipe.findFirst({
      where: {
        id: recipeId,
      },
      include: {
        ingredients: true,
        preparing: true,
      },
    });

    if (!recipeFromDb) {
      throw new NotFoundException();
    }

    return recipeFromDb;
  }
}
