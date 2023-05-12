import { IsString } from 'class-validator';

export class CreateIngredientDTO {
  @IsString()
  name: string;

  @IsString()
  amount: string;
}
