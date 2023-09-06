import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class VerificationTokenDTO {
  @IsString()
  @ApiProperty({ type: 'string', example: 'exampleverificationtoken' })
  verificationToken: string;
}
