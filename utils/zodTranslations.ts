import { z } from "zod";
import { getCookie } from "cookies-next";

// Define error messages for different locales
const errorMessages = {
  en: {
    required: "This field is required",
    minLength: (min: number) => `Must be at least ${min} characters`,
    invalidEmail: "Invalid email address",
    invalidPhone: "Invalid phone number, must be in the format 05xxxxxxxx",
    passwordMinLength: "Password must be at least 8 characters",
    passwordUpperCase: "Password must contain at least one uppercase letter",
    passwordSpecialChar: "Password must contain at least one special character",
    passwordRequired: "Password is required",
    passwordMatch: "Passwords must match",
    emailMatch: "Email addresses must match",
    otpRequired: "Temporary password is required",
  },
  ar: {
    required: "هذا الحقل مطلوب",
    minLength: (min: number) => `يجب أن يكون طول النص ${min} أحرف على الأقل`,
    invalidEmail: "البريد الإلكتروني غير صالح",
    invalidPhone: "رقم الهاتف غير صالح، يجب أن يكون بصيغة 05xxxxxxxx",
    passwordMinLength: "يجب أن تكون كلمة المرور بطول 8 أحرف على الأقل",
    passwordUpperCase: "يجب أن تحتوي كلمة المرور على حرف كبير واحد على الأقل",
    passwordSpecialChar: "يجب أن تحتوي كلمة المرور على رمز خاص واحد على الأقل",
    passwordRequired: "يجب إدخال كلمة المرور",
    passwordMatch: "يجب أن تتطابق كلمة المرور الجديدة مع تأكيد كلمة المرور",
    emailMatch:
      "يجب أن تتطابق البريد الالكتروني الجديد مع تأكيد البريد الالكتروني",
    otpRequired: "يجب إدخال كلمة المرور المؤقتة",
  },
};

// Get error message based on current locale
export const getMessage = (
  key: keyof typeof errorMessages.en,
  param?: any
): string => {
  const localeValue = getCookie("NEXT_LOCALE");
  const locale =
    typeof localeValue === "string" &&
    (localeValue === "en" || localeValue === "ar")
      ? (localeValue as "en" | "ar")
      : "ar";

  const message = errorMessages[locale][key];
  if (typeof message === "function" && param !== undefined) {
    return message(param);
  }
  return message as string;
};

// Create a password validation schema with translated messages
export const createPasswordValidation = () => {
  return z
    .string()
    .min(8, getMessage("passwordMinLength"))
    .regex(/[A-Z]/, getMessage("passwordUpperCase"))
    .regex(/[^A-Za-z0-9]/, getMessage("passwordSpecialChar"));
};

// Create an identifier validation schema with translated messages
export const createIdentifierValidation = () => {
  return z
    .string()
    .min(1, getMessage("required"))
    .refine(
      (value) => {
        if (
          /^[^\d][\w\W]*$/.test(value) ||
          value.includes("@") ||
          value.includes(".")
        ) {
          return z.string().email().safeParse(value).success;
        }
        return true;
      },
      { message: getMessage("invalidEmail") }
    )
    .refine(
      (value) => {
        if (/^\d/.test(value)) {
          return /^05\d{8}$/.test(value);
        }
        return true;
      },
      { message: getMessage("invalidPhone") }
    );
};
