import { z } from "zod";

import { UserRole } from "@/enums/UserRole";

export interface UserResponse {
  id: string;
  username: string;
  name: string;
  email: string;
  role: UserRole;
  token: string;
}

export interface UserLoginRequest {
  username: string;
  password: string;
}

export interface UserLoginResponse {
  token: string;
}

export interface DecodedUser {
  name: string;
  email: string;
  role: UserRole;
}

export const loginSchema = z.object({
  username: z.string().min(1, "กรุณากรอกบัญชีพนักงาน"),
  password: z.string().min(1, "กรุณากรอกรหัสผ่าน"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
