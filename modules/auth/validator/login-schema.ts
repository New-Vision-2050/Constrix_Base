import { z } from "zod";
import { LOGIN_PHASES } from "../constant/login-phase";

const passwordValidation = z
  .string()
  .min(8, "يجب أن تكون كلمة المرور بطول 8 أحرف على الأقل")
  .regex(/[A-Z]/, "يجب أن تحتوي كلمة المرور على حرف كبير واحد على الأقل")
  .regex(/[^A-Za-z0-9]/, "يجب أن تحتوي كلمة المرور على رمز خاص واحد على الأقل");

const identifierSchema = z.object({
  identifier: z
    .string()
    .min(5, "هذا الحقل مطلوب")
    .refine(
      (value) => {
        if (value.includes("@")) {
          return z.string().email().safeParse(value).success;
        }
        return true;
      },
      { message: "البريد الإلكتروني غير صالح" }
    )
    .refine(
      (value) => {
        if (value.startsWith("0")) {
          return /^0(5[0-9]{8})$/.test(value);
        }
        return true;
      },
      { message: "رقم الهاتف غير صالح، يجب أن يكون بصيغة 05xxxxxxxx" }
    ),
  token: z.string().optional(),
});

const passwordSchema = z.object({
  password: z.string().min(1, "يجب إدخال كلمة المرور"),
});

const forgetPasswordSchema = z.object({
  forgetPasswordOtp: z.string().min(5, "يجب إدخال كلمة المرور المؤقتة"),
});

const resetPasswordSchema = z
  .object({
    newPassword: passwordValidation,
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "يجب أن تتطابق كلمة المرور الجديدة مع تأكيد كلمة المرور",
    path: ["confirmNewPassword"],
  });

const validateEmailSchema = z.object({
  validateEmailOtp: z.string().min(5, "يجب إدخال كلمة المرور المؤقتة"),
});

const securityQuestionsSchema = z.object({
  animal: z.string().min(1, "هذا الحقل مطلوب"),
  team: z.string().min(1, "هذا الحقل مطلوب"),
});

const changeEmailSchema = z
  .object({
    newEmail: z
      .string()
      .min(1, "يجب إدخال البريد الاليكتروني")
      .email("بريد اليكتروني غير صالح"),
    confirmNewEmail: z.string(),
  })
  .refine((data) => data.newEmail === data.confirmNewEmail, {
    message:
      "يجب أن تتطابق البريد الاليكتروني الجديد مع تأكيد البريد الاليكتروني",
    path: ["confirmNewEmail"],
  });

const validatePhoneSchema = z.object({
  validatePhoneOtp: z.string().min(5, "يجب إدخال كلمة المرور المؤقتة"),
});

export type IdentifierType = z.infer<typeof identifierSchema>;
export type PasswordType = z.infer<typeof passwordSchema>;
export type ForgetPasswordType = z.infer<typeof forgetPasswordSchema>;
export type ResetPasswordType = z.infer<typeof resetPasswordSchema>;
export type ValidateEmailType = z.infer<typeof validateEmailSchema>;
export type SecurityQuestionsType = z.infer<typeof securityQuestionsSchema>;
export type ChangeEmailType = z.infer<typeof changeEmailSchema>;
export type ValidatePhoneType = z.infer<typeof validatePhoneSchema>;

export const loginSchema = {
  [LOGIN_PHASES.IDENTIFIER]: identifierSchema,
  [LOGIN_PHASES.PASSWORD]: passwordSchema,
  [LOGIN_PHASES.FORGET_PASSWORD]: forgetPasswordSchema,
  [LOGIN_PHASES.RESET_PASSWORD]: resetPasswordSchema,
  [LOGIN_PHASES.VALIDATE_EMAIL]: validateEmailSchema,
  [LOGIN_PHASES.SECURITY_QUESTIONS]: securityQuestionsSchema,
  [LOGIN_PHASES.CHANGE_EMAIL]: changeEmailSchema,
  [LOGIN_PHASES.VALIDATE_PHONE]: validatePhoneSchema,
};

export type LoginType = IdentifierType &
  PasswordType &
  ForgetPasswordType &
  ResetPasswordType &
  ValidateEmailType &
  SecurityQuestionsType &
  ChangeEmailType &
  ValidatePhoneType;
