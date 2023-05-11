import { IsString, MinLength } from 'class-validator';

export class CreateUserDTO {
  @IsString()
  name: string;

  @IsString()
  @MinLength(8)
  password: string;
}
