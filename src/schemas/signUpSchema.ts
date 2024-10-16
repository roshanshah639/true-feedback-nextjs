import { z } from "zod";

// username validations
export const usernameValidation = z
  .string()
  .min(3, { message: "Username must be at least 3 characters long" })
  .max(30, { message: "Username must be at most 30 characters long" })
  .regex(/^[a-zA-Z0-9.-_]+$/, {
    message: "Username must not contain special characters",
  });

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.string().email({
    message: "Please enter a valid email",
  }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});
