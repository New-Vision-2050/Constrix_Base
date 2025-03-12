import { z } from "zod";

export const userSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(1, "Phone is required"),
  title: z.string().min(1, "Title is required"),
  takeTimeZone: z.boolean().default(false),
  country: z.string().min(1, "Name is required"),
  timeZone: z.string().min(1, "Time Zone is required"),
  currency: z.string().min(1, "Currency is required"),
  lang: z.string().min(1, "Lang is required"),
});

export type UserSchemaT = z.infer<typeof userSchema>;
