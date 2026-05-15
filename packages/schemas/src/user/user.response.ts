import { z } from "zod";

export const userProfileSchema = z.object({
  userId: z.number().int().positive().describe("User ID"),
  name: z.string().describe("User name"),
  profileImage: z.string().nullable(),
  isActive: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type UserProfile = z.infer<typeof userProfileSchema>;
