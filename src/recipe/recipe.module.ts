import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RecipeService } from './recipe.service';
import { RecipeController } from './recipe.controller';
import { FindRecipeByIdHandler } from './queries/handlers/findRecipeById.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { RecipeDAO } from 'src/recipe/recipe.dao';
import { FindAllRecipesHandler } from 'src/recipe/queries/handlers/findAllRecipes.handler';
import { CreateRecipeHandler } from 'src/recipe/commands/handlers/createRecipe.handler';
import { UpdateRecipeHandler } from 'src/recipe/commands/handlers/updateRecipe.handler';

export const QueryHandlers = [FindRecipeByIdHandler, FindAllRecipesHandler];
export const CommandHandlers = [CreateRecipeHandler, UpdateRecipeHandler];

@Module({
  imports: [CqrsModule],
  providers: [
    RecipeService,
    ...QueryHandlers,
    ...CommandHandlers,
    PrismaService,
    RecipeDAO,
  ],
  exports: [RecipeService],
  controllers: [RecipeController],
})
export class RecipeModule {}
