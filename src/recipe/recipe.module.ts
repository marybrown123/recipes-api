import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RecipeService } from './recipe.service';
import { RecipeController } from './recipe.controller';
import { FindRecipeByIdHandler } from './queries/handlers/findRecipeById.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { RecipeDAO } from 'src/recipe/recipe.dao';

export const QueryHandlers = [FindRecipeByIdHandler];

@Module({
  imports: [CqrsModule],
  providers: [RecipeService, ...QueryHandlers, PrismaService, RecipeDAO],
  exports: [RecipeService],
  controllers: [RecipeController],
})
export class RecipeModule {}
