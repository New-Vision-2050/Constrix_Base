import { z } from "zod";

export const timeZoneSchema = z.object({
  country: z.string().min(1, "Name is required"),
  timeZone: z.string().min(1, "Time Zone is required"),
  currency: z.string().min(1, "Currency is required"),
  lang: z.string().min(1, "Lang is required"),
});

export type TimeZoneSchema = z.infer<typeof timeZoneSchema>;
