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
import { GatewayModule } from '../websocket/gateway.module';
import { FileService } from '../file/file.service';
import { S3Service } from '../file/s3.service';
import { WebhookModule } from '../webhook/webhook.module';
import { DeleteRecipeHandler } from 'src/recipe/commands/handlers/deleteRecipe.handler';

export const QueryHandlers = [FindRecipeByIdHandler, FindAllRecipesHandler];
export const CommandHandlers = [
  CreateRecipeHandler,
  UpdateRecipeHandler,
  DeleteRecipeHandler,
];

@Module({
  imports: [CqrsModule, GatewayModule, WebhookModule],
  providers: [
    RecipeService,
    ...QueryHandlers,
    ...CommandHandlers,
    PrismaService,
    RecipeDAO,
    FileService,
    S3Service,
  ],
  exports: [RecipeService],
  controllers: [RecipeController],
})
export class RecipeModule {}
