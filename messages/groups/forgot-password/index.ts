import { _m, MessagesGroup } from "../../types";

export const forgotPasswordMessages = new MessagesGroup({
  Title: _m("Forgot Password", "نسيت كلمة المرور"),
  SetUpPassword: _m("Let's Set Up Your Password", "لنقم بإعداد كلمة المرور الخاصة بك"),
  EnterTemporaryPassword: _m("Enter the temporary password sent to your email", "ادخل كلمة المرور المؤقتة المرسلة على البريد الالكتروني"),
  Confirm: _m("Confirm", "تأكيد"),
  BackToLogin: _m("Back to login", "الرجوع للدخول")
});
