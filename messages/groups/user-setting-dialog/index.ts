import { _m, MessagesGroup } from "../../types";

export const userSettingDialogMessages = new MessagesGroup({
  title: _m("User Settings", "اعدادات الموظف"),
  sendLink: _m("Send Link", "ارسال الرابط"),
  sendLinkSuccess: _m("Link sent successfully", "تم ارسال الرابط بنجاح"),
  employeeInOtherCompany: _m("Employee is in another company", "الموظف ينتمي الى شركه اخرى"),
  sendLinkError: _m("Error sending link", "حدث خطأ في ارسال الرابط")
});
