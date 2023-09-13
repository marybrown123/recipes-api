import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateWebhookDTO {
  @IsString()
  @IsOptional()
  @IsUrl()
  @ApiPropertyOptional({ type: 'string', example: 'exampleWebhookName' })
  url?: string;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({ type: 'boolean', example: 'true' })
  isEnabled?: boolean;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({ type: 'number', example: 5 })
  @MaxLength(10)
  @MinLength(1)
  retriesAmount?: number;
}
