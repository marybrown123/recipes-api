import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class FindAllRecipesDTO {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: 'dumplings', type: 'string' })
  name?: string;

  @Transform(({ value }) => (value ? parseInt(value, 10) : null))
  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({ example: 1, type: 'number' })
  page = 1;

  @Transform(({ value }) => (value ? parseInt(value, 10) : null))
  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({ example: 3, type: 'number' })
  limit = 3;
}
