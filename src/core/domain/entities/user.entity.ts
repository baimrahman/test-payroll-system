import { UserRole } from '../enums';

export class User {
  id: string;
  username: string;
  password: string;
  role: UserRole;
  salary: number;
  createdAt: Date;
  updatedAt: Date;
}