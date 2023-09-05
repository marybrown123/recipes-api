import { ApiProperty } from '@nestjs/swagger';

export class AuthenticationTokenDTO {
  @ApiProperty({ type: 'string', example: 'exampleauthenticationtoken' })
  authenticationToken: string;
}
