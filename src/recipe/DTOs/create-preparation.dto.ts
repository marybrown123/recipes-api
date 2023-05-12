import { IsNumber, IsString } from 'class-validator';

export class CreatePreparingDTO {
  @IsString()
  step: string;

  @IsNumber()
  order: number;
}
