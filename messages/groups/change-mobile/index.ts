import { _m, MessagesGroup } from "../../types";

export const changeMobileMessages = new MessagesGroup({
  Title: _m("Change Mobile Number", "تغيير رقم الجوال"),
  CurrentMobile: _m("Current Mobile Number", "رقم الجوال الحالي"),
  NewMobile: _m("New Mobile Number", "رقم الجوال الجديد"),
  Confirm: _m("Confirm", "تأكيد"),
  ChangeMobile: _m("Change Mobile Number", "تغيير رقم الجوال"),
  GenericError: _m("An error occurred, please try again", "حدث خطأ، يرجى المحاولة مرة أخرى"),
  Success: _m("Mobile number changed successfully", "تم تغيير رقم الجوال بنجاح"),
});
