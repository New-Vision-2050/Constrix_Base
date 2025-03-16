import axios from "axios";
import { z } from "zod";
import { EMAIL_EXIST } from "../constants/end-points";
import { User } from "../types/User";
import {getCookie} from "cookies-next";

async function checkEmailExists(
  email: string
): Promise<{ exists: boolean; user?: User }> {
  // ! The following line is a temporary override for testing purposes.
  // Remove it once the backend URL is stable and ready for production.
  const token =  getCookie("new-vision-token");
  const url = `https://core-be-stage.constrix-nv.com/api/v1/company-users/show-by-email/${email}`;
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
