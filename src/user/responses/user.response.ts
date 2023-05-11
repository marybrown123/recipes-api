import { User } from '@prisma/client';

export class UserResponse {
  constructor(user: User) {
    this.name = user.name;
    this.id = user.id;
  }
  name: string;
  id: number;
}
