import { z } from "zod";

export const signUpResponseSchema = z.object({
  id: z.number().int().positive().describe("생성된 사용자 ID"),
  name: z.string().describe("사용자 이름"),
});

export type SignUpResponse = z.infer<typeof signUpResponseSchema>;
