import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateWebhookDTO {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ type: 'string', example: 'exampleWebhookName' })
  url?: string;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({ type: 'boolean', example: 'true' })
  isEnabled?: boolean;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({ type: 'number', example: 5 })
  retriesAmount?: number;
}
