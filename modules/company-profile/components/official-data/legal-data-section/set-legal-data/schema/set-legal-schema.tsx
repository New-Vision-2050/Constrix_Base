import { z } from "zod";
import { RegistrationTypes } from "../../registration-types";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
];

// File schema factory accepting translation function
const createFileSchema = (t: (key: string) => string) =>
  z.union([
    z
      .instanceof(File)
      .refine((file) => file.size <= MAX_FILE_SIZE, {
        message: t("fileSizeError"),
      })
      .refine((file) => ALLOWED_FILE_TYPES.includes(file.type), {
        message: t("fileTypeError"),
      }),
    z
      .object({
        url: z.string(),
      })
      .passthrough(),
  ]);

// Create schema factory function accepting translation function
export const createLegalDataRowSchema = (t: (key: string) => string) =>
  z
    .object({
      // Record ID (required for edit mode, auto-generated for add mode)
      id: z.string().or(z.number()).optional(),

      // Registration type ID (required)
      registration_type_id: z.string({
        required_error: t("registration_type_id_required"),
      }),

      // Registration type type (required for conditional validation logic)
      registration_type_type: z.string({
        required_error: t("registration_type_id_required"),
      }),

      // Registration type name (optional, for display purposes)
      registration_type: z.string().optional(),

      // Registration number (conditional based on type)
      registration_number: z
        .string()
        .regex(/^(700|40|101)\d*$/, t("registrationNumberPattern"))
        .optional()
        .or(z.literal("")),

      // Issue date (required)
      start_date: z
        .string({
          required_error: t("startDateRequired"),
        })
        .or(z.date()),

      // Expiry date (required)
      end_date: z
        .string({
          required_error: t("endDateRequired"),
        })
        .or(z.date()),

      // Attached files (at least one file required)
      files: z.array(createFileSchema(t)).min(1, t("filesRequired")),
    })
    // Validate: registration_number is required if type is not "Without Register"
    .refine(
      (data) => {
        const registrationType = data.registration_type_id?.split("_")?.[1];
        if (registrationType !== RegistrationTypes.WithoutARegister) {
          return (
            !!data.registration_number &&
            data.registration_number.trim().length > 0
          );
        }
        return true;
      },
      {
        message: t("registrationNumberRequiredForType"),
        path: ["registration_number"],
      }
    )
    // Validate: start_date must be before or equal to end_date
    .refine(
      (data) => {
        const startDate = new Date(data.start_date);
        const endDate = new Date(data.end_date);
        return startDate <= endDate;
      },
      {
        message: t("startDateBeforeEndDate"),
        path: ["end_date"],
      }
    );

// Create form schema factory function
export const createLegalDataFormSchema = (t: (key: string) => string) =>
  z.object({
    data: z.array(createLegalDataRowSchema(t)).max(10, t("maxRecords")),
  });

export type LegalDataFormValues = z.infer<
  ReturnType<typeof createLegalDataFormSchema>
>;
