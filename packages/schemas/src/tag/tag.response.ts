import { z } from "zod";

export const tagResponseSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  color: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type TagResponse = z.infer<typeof tagResponseSchema>;
