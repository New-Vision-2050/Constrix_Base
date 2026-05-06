import { _m, MessagesGroup } from "../../types";

export const resetPasswordMessages = new MessagesGroup({
  Title: _m("Reset Password", "اعادة تعيين كلمة المرور"),
  NewPassword: _m("New Password", "كلمة المرور الجديدة"),
  ConfirmNewPassword: _m("Confirm New Password", "تأكيد كلمة المرور الجديدة"),
  PasswordRequirements: _m("Password must be at least 8 characters, contain at least one uppercase letter, and one special character.", "يجب أن تكون كلمة المرور بطول 8 أحرف على الأقل، حرف كبير واحد على الأقل، استخدام رمز خاص واحد على الأقل."),
  Confirm: _m("Confirm", "تأكيد")
});
