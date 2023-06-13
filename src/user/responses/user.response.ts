import { ApiProperty } from '@nestjs/swagger';
import { Role, User } from '@prisma/client';

export class UserResponse implements Omit<User, 'password'> {
  constructor(user: User) {
    this.name = user.name;
    this.id = user.id;
  }
  @ApiProperty()
  name: string;
  @ApiProperty()
  id: number;
  @ApiProperty()
  roles: Role[];
}
