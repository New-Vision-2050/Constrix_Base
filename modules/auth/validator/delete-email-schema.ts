import { z } from "zod";
import { getMessage } from "@/utils/zodTranslations";

export const deleteEmailSchema = z.object({
  firstName: z.string().min(1, getMessage("required") as string),
  lastName: z.string().min(1, getMessage("required") as string),
  email: z
    .string()
    .min(1, getMessage("required") as string)
    .email(getMessage("invalidEmail") as string),
});

export type DeleteEmailType = z.infer<typeof deleteEmailSchema>;
