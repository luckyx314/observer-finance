// src/modules/users/entities/user.entity.ts
export interface User {
  user_id: number;
  username: string;
  password: string; // hashed password
  first_name?: string;
  last_name?: string;
  email?: string;
}
