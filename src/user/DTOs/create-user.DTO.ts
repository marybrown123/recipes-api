import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDTO {
  @IsString()
  @IsEmail()
  @ApiProperty({ type: 'string' })
  name: string;

  @IsString()
  @MinLength(8)
  @ApiProperty({ type: 'string', minLength: 8, format: 'password' })
  password: string;
}
