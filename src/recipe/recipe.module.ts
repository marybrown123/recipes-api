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
import { FileService } from '../recipe/file.service';
import { UploadRecipeImageHandler } from '../recipe/commands/handlers/uploadRecipeImage.handler';
import { S3Service } from '../recipe/s3.service';
import { FetchRecipeImageHandler } from '../recipe/queries/handlers/fetchRecipeImage.handler';

export const QueryHandlers = [
  FindRecipeByIdHandler,
  FindAllRecipesHandler,
  FetchRecipeImageHandler,
];
export const CommandHandlers = [
  CreateRecipeHandler,
  UpdateRecipeHandler,
  UploadRecipeImageHandler,
];

@Module({
  imports: [CqrsModule, GatewayModule],
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
