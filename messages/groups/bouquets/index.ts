import { _m, MessagesGroup } from "../../types";

export const bouquetsMessages = new MessagesGroup({
  AreYouSureReactivate: _m("Are you sure you want to reactivate this package?", "هل أنت متأكد من تنشيط الباقة؟"),
  AreYouSureDeactivate: _m("Are you sure you want to deactivate this package?", "هل أنت متأكد من الغاء تنشيط الباقة؟"),
  // time units
  day: _m("day", "يوم"),
  week: _m("week", "أسبوع"),
  month: _m("month", "شهر"),
  year: _m("year", "سنة")
});
