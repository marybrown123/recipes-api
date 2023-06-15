import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class QueryParameters {
  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'dumplings', type: 'string' })
  name?: string;

  @Transform(({ value }) => (value ? parseInt(value) : null))
  @IsNumber()
  @IsOptional()
  @ApiProperty({ example: 1, type: 'number' })
  page = 1;

  @Transform(({ value }) => (value ? parseInt(value) : null))
  @IsNumber()
  @IsOptional()
  @ApiProperty({ example: 3, type: 'number' })
  limit = 3;
}
