import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';

export class UserResponse {
  constructor(user: User) {
    this.name = user.name;
    this.id = user.id;
  }
  @ApiProperty()
  name: string;
  @ApiProperty()
  id: number;
}
