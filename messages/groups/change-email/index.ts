import { _m, MessagesGroup } from "../../types";

export const changeEmailMessages = new MessagesGroup({
  Title: _m("Change Email Address", "تغيير البريد الالكتروني"),
  NewEmail: _m("New Email Address", "البريد الالكتروني الجديد"),
  ConfirmNewEmail: _m("Confirm New Email Address", "تأكيد البريد الالكتروني الجديد"),
  NoCopy: _m("Email cannot be copied, please type it manually", "لا يمكن نسخ البريد الالكتروني يجب اعادة كتابتها يدويا"),
  Confirm: _m("Confirm", "تأكيد"),
  BackToLogin: _m("Back to login", "الرجوع للدخول")
});
