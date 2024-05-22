import { Group, UserRole } from '@prisma/client';

export interface User {
  id: number;
  fullname: string;
  email: string;
  phoneNumber?: string;
  jobTitle?: string;
  password: string;
  role: UserRole;
  group: Group | null;
}

export interface CreateUser {
  fullname: string;
  email: string;
  pahoneNumber?: string;
  jobTitle?: string;
  password: string;
  role: UserRole;
}
