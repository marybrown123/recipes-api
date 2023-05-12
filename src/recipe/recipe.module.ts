import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RecipeService } from './recipe.service';
import { RecipeController } from './recipe.controller';

@Module({
  providers: [RecipeService, PrismaService],
  exports: [RecipeService],
  controllers: [RecipeController],
})
export class RecipeModule {}
