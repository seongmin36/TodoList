import { z } from "zod";

export const signUpResponseSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
});

export type SignUpResponse = z.infer<typeof signUpResponseSchema>;
