import { ApiProperty } from '@nestjs/swagger';
import { Role, User } from '@prisma/client';

export class UserResponse implements Omit<User, 'password'> {
  constructor(user: User) {
    this.email = user.email;
    this.name = user.name;
    this.id = user.id;
  }
  @ApiProperty({ type: 'string' })
  email: string;

  @ApiProperty({ type: 'string' })
  name: string;

  @ApiProperty({ type: 'number' })
  id: number;

  @ApiProperty({ enum: Role, isArray: true })
  roles: Role[];
}
