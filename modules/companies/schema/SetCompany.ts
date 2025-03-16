import { z } from "zod";

export const companySchema = z.object({
  name: z.string().min(1, "Name is required"),
  domainName: z.string().min(1, "Domain name is required"),
  email: z.string().email("Invalid main"),
  countryId: z.string().min(1, "Please select a country field"),
  supportNvEmployeeId: z
    .string()
    .min(1, "Please select a support new vision employee"),
  companyFieldId: z.string().min(1, "Please select a company field"),
});

export type SetCompanySchema = z.infer<typeof companySchema>;
