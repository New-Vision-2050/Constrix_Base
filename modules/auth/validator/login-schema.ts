import { z } from "zod";
import { LOGIN_PHASES } from "../constant/login-phase";
import {
  createPasswordValidation,
  createIdentifierValidation,
  getMessage,
} from "@/utils/zodTranslations";

// Create schemas with translated messages
const passwordValidation = createPasswordValidation();

const identifierSchema = z.object({
  identifier: createIdentifierValidation(),
  token: z.string().optional(),
  type: z.string().optional(),
  first_login: z.string().optional(),
  by: z.string().optional(),
  login_option_alternatives: z.array(z.string()).optional().nullable(),
});

const passwordSchema = z.object({
  password: z
    .string()
    .min(1, getMessage("passwordRequired") as string)
    .refine((val) => !/\s/.test(val), {
      message: getMessage("passwordNoSpaces") as string,
    }),
});

const forgetPasswordSchema = z.object({
  forgetPasswordOtp: z.string().min(5, getMessage("otpRequired") as string),
});

const resetPasswordSchema = z
  .object({
    newPassword: passwordValidation,
    confirmNewPassword: z.string(),
  })
  .refine(
    (data): data is { newPassword: string; confirmNewPassword: string } =>
      data.newPassword === data.confirmNewPassword,
    {
      message: getMessage("passwordMatch") as string,
      path: ["confirmNewPassword"],
    }
  );

const validateEmailSchema = z.object({
  validateEmailOtp: z.string().min(5, getMessage("otpRequired") as string),
});

const securityQuestionsSchema = z.object({
  animal: z.string().min(1, getMessage("required") as string),
  team: z.string().min(1, getMessage("required") as string),
});

const changeEmailSchema = z
  .object({
    newEmail: z
      .string()
      .min(1, getMessage("required") as string)
      .email(getMessage("invalidEmail") as string),
    confirmNewEmail: z.string(),
  })
  .refine(
    (data): data is { newEmail: string; confirmNewEmail: string } =>
      data.newEmail === data.confirmNewEmail,
    {
      message: getMessage("emailMatch") as string,
      path: ["confirmNewEmail"],
    }
  );

const validatePhoneSchema = z.object({
  validatePhoneOtp: z.string().min(5, getMessage("otpRequired") as string),
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
