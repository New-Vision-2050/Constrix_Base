import { _m, MessagesGroup } from "../../types";

export const loginMessages = new MessagesGroup({
  Control_panel: _m("Control panel", "لوحة التحكم"),
  SignIn: _m("Sign In", "تسجيل الدخول"),
  EnterPassword: _m("Enter Password", "ادخل كلمة المرور"),
  Next: _m("Next", "التالي"),
  Login: _m("Login", "دخول"),
  ForgotPassword: _m("Forgot your password?", "هل نسيت كلمة المرور؟"),
  Identifier: _m("Mobile number / Email / ID number", "رقم الجوال / البريد الالكتروني / رقم المعرف"),
  Password: _m("Password", "كلمة المرور"),
  Copyright: _m("All programming rights reserved for New Vision Technology.", "جميع الحقوق البرمجية محفوظة لشركة نيو فيجن التقنية."),
  Verification: new MessagesGroup({
    Mobile: _m("Mobile Number", "رقم الجوال"),
    Password: _m("Password", "كلمة المرور"),
    Email: _m("Email", "البريد الإليكتروني"),
    Social: _m("Social", "اجتماعي"),
    Barcode: _m("Barcode", "الباركود"),
    LocalNetwork: _m("Local Network", "الشبكة المحلية"),
    ChooseAnotherMethod: _m("Or choose another verification method", "او اختر طريقة تحقق اخرى"),
    VerifyVia: _m("Verify via", "التحقق عن طريق"),
    InvalidOtp: _m("The temporary password is incorrect", "كلمه المرور الموقته غير صحيحية")
  }),
  PhoneVerification: new MessagesGroup({
    Title: _m("Phone Number Verification", "التحقق من رقم الجوال"),
    EnterVerificationCode: _m("Enter the verification code sent to", "ادخل رمز التحقق المرسل الى"),
    ChangePhoneNumber: _m("Change phone number", "تغيير رقم الجوال"),
    "invalid token": _m("Invalid verification code", "رمز التحقق غير صالح"),
    ResendCode: _m("Didn't receive the verification code?", "لم يصلك رمز التحقق؟"),
    Resend: _m("Resend", "إعادة الإرسال")
  }),
  EmailVerification: new MessagesGroup({
    Title: _m("Email Verification", "التحقق من البريد الالكتروني"),
    EnterVerificationCode: _m("Enter the verification code sent to", "ادخل رمز التحقق المرسل على"),
    ChangeEmailAddress: _m("Change email address", "تغيير البريد الالكتروني"),
    "invalid token": _m("Invalid verification code", "رمز التحقق غير صالح")
  })
});
