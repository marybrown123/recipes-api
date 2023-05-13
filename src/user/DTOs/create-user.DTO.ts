import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateUserDTO {
  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @MinLength(8)
  @ApiProperty()
  password: string;
}
