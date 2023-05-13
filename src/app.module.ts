import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { RecipeModule } from './recipe/recipe.module';

@Module({
  imports: [UserModule, AuthModule, RecipeModule],
})
export class AppModule {}
