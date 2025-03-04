import { z } from "zod";

export const companySchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string().min(10, "Phone number is too short"),
  countryId: z.number().int().positive({ message: "Please select a country" }),
  companyTypeId: z.string().min(1, "Please select a company type"),
  companyFieldId: z.string().min(1, "Please select a company field"),
  generalManagerId: z.string().min(1, "Please select a general manager"),
  registrationTypeId: z.string().min(1, "Please select a registration type"),
  registrationNo: z.string().nullable(),
  classificationNo: z.string().nullable(),
  userName: z.string().min(1, "Username is required"),
});

export type SetCompanySchema = z.infer<typeof companySchema>;
