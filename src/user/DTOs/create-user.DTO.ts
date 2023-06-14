import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateUserDTO {
  @IsString()
  @ApiProperty({ type: 'string' })
  name: string;

  @IsString()
  @MinLength(8)
  @ApiProperty({ type: 'string' })
  password: string;
}
