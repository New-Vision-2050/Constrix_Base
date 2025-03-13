import axios from "axios";
import { z } from "zod";
import { EMAIL_EXIST } from "../constants/end-points";
import { User } from "../types/User";

async function checkEmailExists(
  email: string
): Promise<{ exists: boolean; user?: User }> {
  // ! The following line is a temporary override for testing purposes.
  // Remove it once the backend URL is stable and ready for production.
  const token = `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vY29yZS1iZS1wcjE3LmNvbnN0cml4LW52LmNvbS9hcGkvdjEvYXV0aHMvbG9naW4iLCJpYXQiOjE3NDE4MTE3MDMsImV4cCI6MTc0MTg5ODEwMywibmJmIjoxNzQxODExNzAzLCJqdGkiOiI0V2puUzJITVBxUGJtdzNPIiwic3ViIjoiYzcxMTkxYjUtZWJjZS00ZmQxLTlhNjgtYzIwOTljMmEzZjM5IiwicHJ2IjoiYmI2NWQ5YjhmYmYwZGE5ODI3YzhlZDIzMWQ5YzU0YzgxN2YwZmJiMiJ9.Dk1YdDd03FOWfrCfKeNNdNG7KlI0oy6ri4xCx3qznvU`;
  const url = `https://core-be-pr17.constrix-nv.com/api/v1/company-users/show-by-email/${email}`;
  try {
    const response = await axios<{ company_user: User }>(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.data.company_user) {
      return { exists: true, user: response.data.company_user };
    }
    return { exists: false };
  } catch (error) {
    console.log("error", error);
    return { exists: false };
  }
}

export const userSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z
    .string()
    .email("Invalid email")
    .refine(async (email) => {
      const { exists, user } = await checkEmailExists(email);
      if (exists) {
        throw new z.ZodError([
          {
            path: ["email"],
            message: `${EMAIL_EXIST}#${user?.id}`,
            fatal: true,
            code: "custom",
            params: { user },
          },
        ]);
      }
      return true;
    }),
  phone: z.string().min(1, "Phone is required"),
  title: z.string().min(1, "Title is required"),
  takeTimeZone: z.boolean().default(false).optional(),
  country: z.string().optional(),
  timeZone: z.string().optional(),
  currency: z.string().optional(),
  lang: z.string().optional(),
});

export type UserSchemaT = z.infer<typeof userSchema>;
