import { z } from "zod";

import { UserRole } from "@/enums/UserRole";

export interface Memo {
  id: string;
  title: string;
  content: string;
  userType: UserRole;
  createdAt: string;
}

export interface MemoRequest {
  content: string;
}

export const CreateMemoSchema = z.object({
  content: z.string().nonempty("กรุณากรอกเนื้อหาบันทึก"),
});

export type CreateMemoValue = z.infer<typeof CreateMemoSchema>;
