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

const fileSchema = z.union([
    z.instanceof(File).refine(
        (file) => file.size <= MAX_FILE_SIZE,
        { message: "حجم الملف يجب أن يكون أقل من 5 ميجابايت" }
    ).refine(
        (file) => ALLOWED_FILE_TYPES.includes(file.type),
        { message: "نوع الملف غير مسموح" }
    ),
    z.object({
        url: z.string(),
    }).passthrough(),
]);

const legalDataRowSchema = z.object({
    id: z.string().or(z.number()).optional(),
    // id of the registration type
    registration_type_id: z.string(),
    // type of the registration type
    registration_type_type: z.string().optional(),
    // name of the registration type
    registration_type: z.string().optional(),
    // registration number
    registration_number: z.string()
        .regex(/^700\d*$/, "يجب أن يبدأ الرقم بـ 700 ويحتوي على أرقام فقط")
        .optional(),
    // start date
    start_date: z.string({
        required_error: "ادخل تاريخ الاصدار",
    }).or(z.date()),
    // end date
    end_date: z.string({
        required_error: "ادخل تاريخ الانتهاء",
    }).or(z.date()),
    // files
    files: z.array(fileSchema).min(1, "يجب إرفاق ملف"),
}).refine(
    (data) => {
        if (data.registration_type_type != RegistrationTypes.WithoutARegister) {
            return !!data.registration_number;
        }
        return true;
    },
    {
        message: "رقم التسجيل مطلوب",
        path: ["registration_number"],
    }
).refine(
    (data) => {
        const startDate = new Date(data.start_date);
        const endDate = new Date(data.end_date);
        return startDate <= endDate;
    },
    {
        message: "تاريخ الإصدار يجب أن يكون قبل تاريخ الانتهاء",
        path: ["end_date"],
    }
);

export const legalDataFormSchema = z.object({
    data: z.array(legalDataRowSchema).max(10, "الحد الأقصى 10 سجلات"),
});

export type LegalDataFormValues = z.infer<typeof legalDataFormSchema>;