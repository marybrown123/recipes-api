import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RecipeService } from './recipe.service';
import { RecipeController } from './recipe.controller';
import { FindRecipeByIdHandler } from './queries/handlers/findRecipeById.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { RecipeDAO } from '../recipe/recipe.dao';
import { FindAllRecipesHandler } from '../recipe/queries/handlers/findAllRecipes.handler';
import { CreateRecipeHandler } from '../recipe/commands/handlers/createRecipe.handler';
import { UpdateRecipeHandler } from '../recipe/commands/handlers/updateRecipe.handler';
import { NotificationsGateway } from 'src/gateways/notification.gateway';

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
    NotificationsGateway,
  ],
  exports: [RecipeService],
  controllers: [RecipeController],
})
export class RecipeModule {}
