import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateIngredientDTO } from './create-ingredient.dto';
import { CreatePreparingDTO } from './create-preparation.dto';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateRecipeDTO {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: 'Dumplings', type: 'string' })
  name?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: 'Easy dumplings recipe', type: 'string' })
  description?: string;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({ example: 'imageKey', type: 'string' })
  fileId?: number;

  @ValidateNested()
  @IsOptional()
  @Type(() => CreatePreparingDTO)
  @ApiPropertyOptional({
    type: CreatePreparingDTO,
    isArray: true,
  })
  preparing?: CreatePreparingDTO[];

  @ValidateNested()
  @IsOptional()
  @Type(() => CreateIngredientDTO)
  @ApiPropertyOptional({
    type: CreateIngredientDTO,
    isArray: true,
  })
  ingredients?: CreateIngredientDTO[];
}
