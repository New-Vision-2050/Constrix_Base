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
    // Record ID (required for edit mode, auto-generated for add mode)
    id: z.string().or(z.number()).optional(),
    
    // Registration type ID (required)
    registration_type_id: z.string({
        required_error: "نوع التسجيل مطلوب",
    }),
    
    // Registration type type (required for conditional validation logic)
    registration_type_type: z.string({
        required_error: "نوع التسجيل مطلوب",
    }),
    
    // Registration type name (optional, for display purposes)
    registration_type: z.string().optional(),
    
    // Registration number (conditional based on type)
    registration_number: z.string()
        .regex(
            /^(700|40|101)\d*$/, 
            "يجب أن يبدأ الرقم بـ 700 أو 40 أو 101 ويحتوي على أرقام فقط"
        )
        .min(1, "رقم التسجيل لا يمكن أن يكون فارغاً")
        .optional(),
    
    // Issue date (required)
    start_date: z.string({
        required_error: "ادخل تاريخ الاصدار",
    }).or(z.date()),
    
    // Expiry date (required)
    end_date: z.string({
        required_error: "ادخل تاريخ الانتهاء",
    }).or(z.date()),
    
    // Attached files (at least one file required)
    files: z.array(fileSchema).min(1, "يجب إرفاق ملف واحد على الأقل"),
})
    // Validate: registration_number is required if type is not "Without Register"
    .refine(
        (data) => {
            if (data.registration_type_type !== RegistrationTypes.WithoutARegister) {
                return !!data.registration_number && data.registration_number.trim().length > 0;
            }
            return true;
        },
        {
            message: "رقم التسجيل مطلوب لهذا النوع",
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
            message: "تاريخ الإصدار يجب أن يكون قبل تاريخ الانتهاء",
            path: ["end_date"],
        }
    );

export const legalDataFormSchema = z.object({
    data: z.array(legalDataRowSchema).max(10, "الحد الأقصى 10 سجلات"),
});

export type LegalDataFormValues = z.infer<typeof legalDataFormSchema>;