import { _m, MessagesGroup } from "../../types";

export const headerMessages = new MessagesGroup({
  MainSystemManagement: _m("Main System Management", "ادارة النظام الرئيسي"),
  Logout: _m("Logout", "تسجيل الخروج"),
  branches: _m("Branches", "الفروع"),
  profile: _m("My account", "حسابي"),
  changeMail: _m("Change email", "تغيير البريد الالكتروني"),
  changePassword: _m("Change password", "تغيير كلمة المرور")
});
