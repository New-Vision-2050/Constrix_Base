import { _m, MessagesGroup } from "../../types";

export const changePasswordMessages = new MessagesGroup({
  Title: _m("Change Password", "تغيير كلمة المرور"),
  CurrentPassword: _m("Current Password", "كلمة المرور الحالية"),
  NewPassword: _m("New Password", "كلمة المرور الجديدة"),
  ConfirmNewPassword: _m("Confirm New Password", "تأكيد كلمة المرور الجديدة"),
  Confirm: _m("Confirm", "تأكيد"),
  GenericError: _m("An error occurred, please try again", "حدث خطأ، يرجى المحاولة مرة أخرى"),
  Success: _m("Password changed successfully", "تم تغيير كلمة المرور بنجاح"),
  PasswordMismatch: _m("Passwords do not match", "كلمات المرور غير متطابقة"),
  CurrentPasswordRequired: _m("Current password is required", "كلمة المرور الحالية مطلوبة"),
  NewPasswordRequired: _m("New password is required", "كلمة المرور الجديدة مطلوبة"),
});
