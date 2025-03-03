import { z } from "zod";

export const companySchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string().min(10, "Phone number is too short"),
  countryId: z.number().int().positive(),
  companyTypeId: z.string(),
  companyFieldId: z.string(),
  generalManagerId: z.string(),
  registrationTypeId: z.string(),
  registrationNo: z.string().nullable(),
  classificationNo: z.string().nullable(),
  companyName: z.string(),
  companyEmail: z.string(),
  userName: z.string(),
});

export type SetCompanySchema = z.infer<typeof companySchema>;
