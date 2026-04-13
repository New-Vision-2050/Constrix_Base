import { z } from "zod";

export const ClientRequestschema = z.object({
  client_request_type_id: z.string().min(1, "نوع الطلب مطلوب"),
  client_request_receiver_from_id: z.string().min(1, "جهة الورود مطلوبة"),
  client_type: z.enum(["individual", "company"]),
  client_id: z.string().min(1, "العميل مطلوب"),
  content: z.string().optional(),
  status_client_request: z.string().optional(),
  service_ids: z.array(z.number()).optional(),
  term_setting_id: z
    .array(
      z.object({
        term_service_id: z.number(),
        term_ids: z.array(z.number()),
      }),
    )
    .optional(),
  branch_id: z.string().nullable().optional(),
  management_id: z.string().nullable().optional(),
  attachments: z.array(z.instanceof(File)).optional(),
  receiver_phone: z.string().optional(),
  receiver_email: z.union([z.string().email(), z.literal("")]).optional(),
  receiver_employee_id: z.string().optional(),
  /** Stored as string to match API ids (numeric or UUID); sent in multipart as-is */
  receiver_employee_ids: z.array(z.string()).optional(),
  receiver_broker_id: z.string().optional(),
  receiver_broker_type: z.union([z.enum(["individual", "company"]), z.literal("")]).optional(),
  /** Shown when sending with reject; validated on submit in the drawer */
  reject_cause: z.string().optional(),
});

export type ClientRequestFormValues = z.infer<typeof ClientRequestschema>;
