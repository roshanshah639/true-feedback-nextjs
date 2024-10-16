import { z } from "zod";

export const messageSchema = z.object({
  content: z
  .string()
  .min(10, { message: "Message must be at least 10 characters long" }),
  .max(350, { message: "Message must be at most 350 characters long" }),
});
