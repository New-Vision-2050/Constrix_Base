import { z } from "zod";

export const CustomerRequestSchema = z.object({
  client_request_type_id: z.string().min(1, "نوع الطلب مطلوب"),
  client_request_receiver_from_id: z.string().min(1, "جهة الورود مطلوبة"),
  client_type: z.enum(["individual", "company"]),
  client_id: z.string().min(1, "العميل مطلوب"),
  content: z.string().optional(),
  status_client_request: z.string().optional(),
  service_ids: z.array(z.number()).optional(),
  term_setting_id: z.array(z.number()).optional(),
  branch_id: z.string().nullable().optional(),
  management_id: z.string().nullable().optional(),
  attachments: z.array(z.instanceof(File)).optional(),
});

export type CustomerRequestFormValues = z.infer<typeof CustomerRequestSchema>;
