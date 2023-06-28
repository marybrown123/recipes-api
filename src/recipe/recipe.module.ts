import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RecipeService } from './recipe.service';
import { RecipeController } from './recipe.controller';
import { FindRecipeByIdHandler } from '../recipe/queries/handlers/find-recipe-by-id.handler';
import { CqrsModule } from '@nestjs/cqrs';

export const QueryHandlers = [FindRecipeByIdHandler];

@Module({
  imports: [CqrsModule],
  providers: [RecipeService, ...QueryHandlers, PrismaService],
  exports: [RecipeService],
  controllers: [RecipeController],
})
export class RecipeModule {}
