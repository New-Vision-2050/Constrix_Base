import { z } from "zod";

export const userSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(1, "Phone is required"),
  title: z.string().min(1, "Title is required"),
  takeTimeZone: z.boolean().default(false).optional(),
  country: z.string().optional(),
  timeZone: z.string().optional(),
  currency: z.string().optional(),
  lang: z.string().optional(),
});

export type UserSchemaT = z.infer<typeof userSchema>;
