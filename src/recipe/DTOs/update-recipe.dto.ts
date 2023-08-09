import { IsString, ValidateNested } from 'class-validator';
import { CreateIngredientDTO } from './create-ingredient.dto';
import { CreatePreparingDTO } from './create-preparation.dto';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateImageDTO } from 'src/recipe/DTOs/create-image.dto';

export class UpdateRecipeDTO {
  @IsString()
  @ApiProperty({ example: 'Dumplings', type: 'string' })
  name?: string;

  @IsString()
  @ApiProperty({ example: 'Easy dumplings recipe', type: 'string' })
  description?: string;

  @ValidateNested()
  @Type(() => CreateImageDTO)
  @ApiProperty({ type: CreateImageDTO })
  image?: CreateImageDTO;

  @ValidateNested()
  @Type(() => CreatePreparingDTO)
  @ApiProperty({ type: [CreatePreparingDTO], isArray: true })
  preparing?: CreatePreparingDTO[];

  @ValidateNested()
  @Type(() => CreateIngredientDTO)
  @ApiProperty({ type: [CreateIngredientDTO], isArray: true })
  ingredients?: CreateIngredientDTO[];
}
