import { z } from "zod";
import { signupSchema } from "@repo/schemas";

export const signupFormSchema = signupSchema
  .extend({ passwordConfirm: z.string() })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "비밀번호가 일치하지 않습니다",
    path: ["passwordConfirm"],
  });

export type SignupFormInput = z.infer<typeof signupFormSchema>;
