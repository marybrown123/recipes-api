import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateIngredientDTO } from './create-ingredient.dto';
import { CreatePreparingDTO } from './create-preparation.dto';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRecipeDTO {
  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Dumplings', type: 'string' })
  name?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Easy dumplings recipe', type: 'string' })
  description?: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ example: 'imageKey', type: 'string' })
  fileId?: number;

  @ValidateNested()
  @IsOptional()
  @Type(() => CreatePreparingDTO)
  @ApiProperty({ type: [CreatePreparingDTO], isArray: true })
  preparing?: CreatePreparingDTO[];

  @ValidateNested()
  @IsOptional()
  @Type(() => CreateIngredientDTO)
  @ApiProperty({ type: [CreateIngredientDTO], isArray: true })
  ingredients?: CreateIngredientDTO[];
}
